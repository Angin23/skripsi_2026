/* 
   EKSTRAKSI NDVI BULANAN PER PROVINSI INDONESIA
   Sumber   : MODIS/061/MOD13Q1 (Terra Vegetation Indices, 16-Day, 250m)
   Periode  : 2010-2025
   Tujuan   : Variabel kontrol/robustness kondisi vegetasi 

   Catatan:
   1. Koleksi MODIS/061/MOD13Q1 (aktif, diperbarui rutin).
   2. Scale factor resmi produk (0.0001) diterapkan sebelum agregasi.
   3. Quality masking berbasis band SummaryQA diterapkan sebelum
      composite, untuk membuang piksel berawan/salju-es.
   4. Resolusi reduceRegions disamakan dengan resolusi native (250 m).
   5. Agregasi dilakukan bulanan (bukan tahunan) sesuai kebutuhan
      penelitian untuk menangkap variasi yang lebih halus.
   6. tileScale ditambahkan untuk menghindari error memori/timeout
      pada provinsi luas (Papua, Kalimantan Tengah, dsb.).
   7. Ekspor dipecah per tahun.
   8. Boundary provinsi GAUL 2024. */

// ========= 1. PROVINSI INDONESIA =========
var provRaw = ee.FeatureCollection(
  "projects/ee-222212608/assets/BATAS_PROVINSI_DESEMBER_2019_34_Provinsi"
);

var prov = provRaw.map(function (f) {
  return f.simplify(100);
});

Map.addLayer(prov, {}, 'Provinsi');
Map.setCenter(118, -2, 5);

// --- Verifikasi ---
// print("Contoh atribut satu provinsi:", prov.first());

// Sesuaikan nama field hasil verifikasi
// print("Jumlah unit provinsi:", prov.size());
// print("Daftar nama provinsi:", prov.aggregate_array('NAMA_FIELD_PROVINSI'));

print("Jumlah unit provinsi:", prov.size());
print("Daftar nama provinsi:", prov.aggregate_array('PROVINSI'));

// Ekspor daftar nama provinsi untuk pengecekan manual di luar GEE
Export.table.toDrive({
  collection: prov.select(['PROVINSI']),
  description: "Cek_Nama_Provinsi_BIG2019",
  fileFormat: "CSV"
});

// ========= 2. NDVI MODIS (Collection 061) =========
var ndviRaw = ee.ImageCollection("MODIS/061/MOD13Q1");

// Fungsi quality masking + penerapan scale factor
// SummaryQA: 0 = baik, 1 = marginal, 2 = tertutup salju/es, 3 = berawan
// Hanya kategori 0 dan 1 yang dipertahankan.
function maskAndScale(image) {
  var qa = image.select('SummaryQA');
  var goodQuality = qa.lte(1);
  return image.updateMask(goodQuality)
              .select('NDVI')
              .multiply(0.0001)               // scale factor resmi produk
              .copyProperties(image, ['system:time_start']);
}

var ndviClean = ndviRaw.map(maskAndScale);

// ========= 3. FUNGSI NDVI BULANAN PER PROVINSI =========
function getMonthlyNDVI(year, month) {
  var start = ee.Date.fromYMD(year, month, 1);
  var end   = start.advance(1, 'month');

  var ndviMonth = ndviClean
                    .filterDate(start, end)
                    .mean()
                    .clip(prov);

  var zonal = ndviMonth.reduceRegions({
    collection: prov,
    reducer: ee.Reducer.mean(),
    scale: 250,        // resolusi native MOD13Q1
    tileScale: 4        
  });

  return zonal.map(function (f) {
    return f.set('year', year)
            .set('month', month)
            .set('ndvi_mean', f.get('mean'));
  });
}

// ========= 4. EKSPOR PER TAHUN (2010-2025) =========
var startYear = 2010;
var endYear   = 2025;

for (var year = startYear; year <= endYear; year++) {
  var months = ee.List.sequence(1, 12);

  var yearResult = ee.FeatureCollection(
    months.map(function (m) {
      return getMonthlyNDVI(year, m);
    })
  ).flatten();

  Export.table.toDrive({
    collection: yearResult,
    description: "NDVI_Bulanan_Provinsi_" + year,
    fileFormat: "CSV",
    selectors: ["PROVINSI", "year", "month", "ndvi_mean"]
  });
}

var jakarta = prov.filter(ee.Filter.eq('PROVINSI', 'DKI JAKARTA')); // sesuaikan penulisan persis dgn hasil print sebelumnya

function diagnosa(year, month) {
  var start = ee.Date.fromYMD(year, month, 1);
  var end   = start.advance(1, 'month');

  var raw = ee.ImageCollection("MODIS/061/MOD13Q1")
              .filterDate(start, end);

  print("Jumlah citra tersedia (" + year + "-" + month + "):", raw.size());

  var rawMean = raw.select('NDVI').mean();
  var maskedMean = ndviClean.filterDate(start, end).mean();

  print("Rata-rata NDVI TANPA masking:",
    rawMean.reduceRegion({reducer: ee.Reducer.mean(), geometry: jakarta.geometry(), scale: 250, tileScale: 4}));
  print("Rata-rata NDVI DENGAN masking:",
    maskedMean.reduceRegion({reducer: ee.Reducer.mean(), geometry: jakarta.geometry(), scale: 250, tileScale: 4}));
}

diagnosa(2011, 1);
diagnosa(2024, 11);
diagnosa(2024, 12);
