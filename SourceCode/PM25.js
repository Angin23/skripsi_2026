/* 
   EKSTRAKSI PM2.5 BULANAN PER PROVINSI INDONESIA
   
   Sumber   : ACAG/Washington University, Global Monthly Satellite-derived
              PM2.5, dikurasi di GEE community catalog oleh Samapriya Roy
              (projects/sat-io/open-datasets).

   Rujukan dataset:
   Shen, S., Li, C., van Donkelaar, A., Jacobs, N., Wang, C., & Martin, R. V.
   (2024). Enhancing global estimation of fine particulate matter
   concentrations by including geophysical a priori information in deep
   learning. ACS ES&T Air, 1(5), 332-345.
   https://doi.org/10.1021/acsestair.3c00054
 */

// ========= 1. PROVINSI INDONESIA =========
var provRaw = ee.FeatureCollection(
  "projects/ee-222212608/assets/BATAS_PROVINSI_DESEMBER_2019_34_Provinsi"
);

var prov = provRaw.map(function (f) {
  return f.simplify(100);
});

Map.addLayer(prov, {}, 'Provinsi');
Map.setCenter(118, -2, 5);

print("Jumlah unit provinsi:", prov.size());
print("Daftar nama provinsi:", prov.aggregate_array('PROVINSI'));

// ========= 2. PM2.5 (ACAG/WashU, via sat-io) =========
var pm25Raw = ee.ImageCollection("projects/sat-io/open-datasets/GLOBAL-SATELLITE-PM25/MONTHLY");

print("Jumlah total citra dalam koleksi:", pm25Raw.size());
print("Tanggal citra PALING AWAL:",
  ee.Date(pm25Raw.sort('system:time_start', true).first().get('system:time_start')));
print("Tanggal citra PALING AKHIR:",
  ee.Date(pm25Raw.sort('system:time_start', false).first().get('system:time_start')));

var pm25Clean = pm25Raw.map(function (image) {
  return image.select('b1')
              .copyProperties(image, ['system:time_start']);
});

// --- Validasi : nilai Jakarta Agustus 2019 sbg sanity-check ---
var titikJakarta = ee.Geometry.Point([106.8456, -6.2088]);
var citraCekAgustus2019 = pm25Clean.filterDate('2019-08-01', '2019-09-01').first();
print("Sanity-check Jakarta Agustus 2019 (harus ~54,84):",
  citraCekAgustus2019.reduceRegion({
    reducer: ee.Reducer.mean(), geometry: titikJakarta, scale: 1000
  }));

// ========= 3. FUNGSI PM2.5 BULANAN PER PROVINSI =========
function getMonthlyPM25(year, month) {
  var start = ee.Date.fromYMD(year, month, 1);
  var end   = start.advance(1, 'month');

  var pm25Month = pm25Clean
                    .filterDate(start, end)
                    .mean()
                    .clip(prov);

  var zonal = pm25Month.reduceRegions({
    collection: prov,
    reducer: ee.Reducer.mean(),
    scale: 1000,       
    tileScale: 4
  });

  return zonal.map(function (f) {
    return f.set('year', year)
            .set('month', month)
            .set('pm25_ugm3_mean', f.get('mean'));
  });
}

// ========= 4. EKSPOR PER TAHUN =========
var startYear = 2010;
var endYear   = 2022; // <- lihat hasil verifikasi Bagian 2

for (var year = startYear; year <= endYear; year++) {
  var months = ee.List.sequence(1, 12);

  var yearResult = ee.FeatureCollection(
    months.map(function (m) {
      return getMonthlyPM25(year, m);
    })
  ).flatten();

  Export.table.toDrive({
    collection: yearResult,
    description: "PM25_Bulanan_Provinsi_DIPERBAIKI_" + year,
    fileFormat: "CSV",
    selectors: ["PROVINSI", "year", "month", "pm25_ugm3_mean"]
  });
}