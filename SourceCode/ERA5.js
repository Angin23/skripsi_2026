// 1. SHAPEFILE
var provinsi = ee.FeatureCollection(
  "projects/skripsi-509707/assets/BATAS_PROVINSI_DESEMBER_2019_DUKCAPIL"
);

// 2. ERA5-LAND MONTHLY (DIPERBAIKI)
var era5 = ee.ImageCollection("ECMWF/ERA5_LAND/MONTHLY_AGGR");

// cek band tersedia
print("Nama band ERA5-Land:", era5.first().bandNames());

// verifikasi cakupan tanggal 
print("Tanggal citra PALING AKHIR yang tersedia:",
  ee.Date(era5.sort('system:time_start', false).first().get('system:time_start')));

// 3. FILTER PERIODE
var era_period = era5.filterDate('2010-01-01', '2026-01-01');

print("Jumlah citra bulanan ditemukan:", era_period.size());
print(
  "[Panduan] Harapan maksimum 2010-2025 = 192 bulan. Kalau jauh di bawah " +
  "itu, cek tanggal citra terakhir di atas -- mungkin ada bulan-bulan " +
  "terbaru yang belum diproses ECMWF (lag ~3 bulan dari hari ini adalah wajar)."
);

// 4. EKSTRAK PER IMAGE
var ekstrak = era_period.map(function (image) {
  var date = ee.Date(image.get('system:time_start'));
  // suhu Celsius (band ERA5-Land: temperature_2m, satuan Kelvin)
  var Temp = image
    .select('temperature_2m')
    .subtract(273.15)
    .rename('Temp');

  // relative humidity (band ERA5-Land: dewpoint_temperature_2m)
  var Td = image.select('dewpoint_temperature_2m');
  var T  = image.select('temperature_2m');

  var RH = Td.expression(
    '100 * (exp((17.625*(Td-273.15))/(243.04+(Td-273.15))) / exp((17.625*(T-273.15))/(243.04+(T-273.15))))',
    { Td: Td, T: T }
  ).rename('RH');

  // wind speed 
  var u = image.select('u_component_of_wind_10m');
  var v = image.select('v_component_of_wind_10m');

  var Wind = u.pow(2).add(v.pow(2)).sqrt().rename('Wind');
  // gabungkan
  var gabung = ee.Image.cat([Temp, RH, Wind]);

  // zonal statistik
  var stats = gabung.reduceRegions({
    collection: provinsi,
    reducer: ee.Reducer.mean(),
    scale: 11132,   // resolusi native ERA5-Land (~11 km)
    tileScale: 4
  });

  // tambah waktu
  return stats.map(function (f) {
    return f.set({
      tahun: date.get('year'),
      bulan: date.get('month')
    });
  });
});

// 5. FLATTEN
var hasil = ekstrak.flatten();

// cek jumlah baris 
print("Jumlah total record", hasil.size());

// 6. EXPORT
Export.table.toDrive({
  collection: hasil,
  description: 'ERA5_2010_2025_DIPERBAIKI',
  fileFormat: 'CSV',
  selectors: [
    'PROVINSI',
    'tahun',
    'bulan',
    'Temp',
    'RH',
    'Wind'
  ]
});

print("Jumlah citra ERA5-Land keseluruhan (tanpa filter tanggal):", era5.size());
print("Contoh feature provinsi pertama:", provinsi.first());