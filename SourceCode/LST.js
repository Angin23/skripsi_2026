/* 
   EKSTRAKSI LST BULANAN PER PROVINSI INDONESIA
   Sumber   : MODIS/061/MOD11A2 (Terra Land Surface Temperature, 8-Day, 1km)
   Periode  : 2010-2025
   Tujuan   : Variabel kontrol/robustness 

   Catatan:
   1. Resolusi native 1000 m.
   2. Komposit 8 hari.
   3. Band LST_Day_1km dikonversi: nilai mentah x 0.02 (scale
      factor resmi produk) menghasilkan satuan Kelvin, lalu dikurangi
      273.15 untuk mendapat Celsius.
   4. Quality masking berbasis band QC_Day (bitmask).
      Bit 0-1 adalah flag kualitas wajib: 00 = piksel diproduksi,
      kualitas baik. Nilai selain
      itu (01/10/11) dibuang.*/

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

// ========= 2. LST MODIS (Collection 061) =========
var lstRaw = ee.ImageCollection("MODIS/061/MOD11A2");

// Fungsi ekstraksi bit QA (bit 0-1 dari QC_Day)
function bitwiseExtract(input, fromBit, toBit) {
  var maskSize = ee.Number(1).add(toBit).subtract(fromBit);
  var mask = ee.Number(1).leftShift(maskSize).subtract(1);
  return input.rightShift(fromBit).bitwiseAnd(mask);
}

// Fungsi quality masking + konversi skala + Kelvin ke Celsius
function maskAndScaleLST(image) {
  var qcDay = image.select('QC_Day');
  // Bit 0-1: 00 = kualitas baik. Hanya piksel ini yang dipertahankan.
  var mandatoryQA = bitwiseExtract(qcDay, 0, 1).eq(0);

  var lstCelsius = image.select('LST_Day_1km')
                    .multiply(0.02)   // scale factor resmi produk -> Kelvin
                    .subtract(273.15) // Kelvin -> Celsius
                    .updateMask(mandatoryQA);

  return lstCelsius.rename('LST_C')
                    .copyProperties(image, ['system:time_start']);
}

var lstClean = lstRaw.map(maskAndScaleLST);

// ========= 3. FUNGSI LST BULANAN PER PROVINSI =========
function getMonthlyLST(year, month) {
  var start = ee.Date.fromYMD(year, month, 1);
  var end   = start.advance(1, 'month');

  var lstMonth = lstClean
                    .filterDate(start, end)
                    .mean()
                    .clip(prov);

  var zonal = lstMonth.reduceRegions({
    collection: prov,
    reducer: ee.Reducer.mean(),
    scale: 1000,       // resolusi native MOD11A2
    tileScale: 4         
  });

  return zonal.map(function (f) {
    return f.set('year', year)
            .set('month', month)
            .set('lst_celsius_mean', f.get('mean'));
  });
}

// ========= 4. EKSPOR PER TAHUN (2010-2025) =========
var startYear = 2010;
var endYear   = 2025;

for (var year = startYear; year <= endYear; year++) {
  var months = ee.List.sequence(1, 12);

  var yearResult = ee.FeatureCollection(
    months.map(function (m) {
      return getMonthlyLST(year, m);
    })
  ).flatten();

  Export.table.toDrive({
    collection: yearResult,
    description: "LST_Bulanan_Provinsi_" + year,
    fileFormat: "CSV",
    selectors: ["PROVINSI", "year", "month", "lst_celsius_mean"]
  });
}
