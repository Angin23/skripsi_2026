# Dokumentasi dan Panduan Penggunaan Dashboard PDRB Hijau 34 Provinsi di Indonesia Periode 2010-2025

Dokumen ini menjelaskan tujuan, arsitektur data, spesifikasi, dan cara penggunaan dashboard interaktif _Analisis PDRB Hijau 34 Provinsi di Indonesia Periode 2010–2025_. Tautan akses tersedia pada [tableau_links.md](tableau_links.md).

## 1. Tujuan dan Ruang Lingkup

Dashboard berfungsi sebagai artefak utama penelitian untuk menyajikan hasil analisis PDRB Hijau secara visual dan eksploratif. Dashboard memungkinkan pemangku kepentingan membandingkan kinerja ekonomi dan tekanan lingkungan provinsi di Indonesia periode 2010-2025.

Ruang lingkup dasbor meliputi empat indikator utama:

1. PDRB;
2. PDRB Hijau;
3. deforestasi; dan
4. konsentrasi PM2.5.

Cakupan wilayah adalah 34 provinsi di Indonesia dengan periode 2010–2025.

## 2. Arsitektur dan Alur Data

| Tahap | Komponen                  | Fungsi                                        |
| ----- | ------------------------- | --------------------------------------------- |
| 1     | Google Earth Engine (GEE) | Akuisisi dan pengolahan data geospasial       |
| 2     | Google Colab              | Pembersihan, transformasi, dan integrasi data |
| 3     | Tableau Public            | Pemodelan tampilan dan visualisasi interaktif |
| 4     | Pengguna akhir            | Eksplorasi melalui peramban (_browser_)       |

```
GEE  →  Colab  →  Tableau Public  →  Pengguna
```

## 3. Pratinjau Antarmuka

![Pratinjau dasbor Tableau](../docs/images/tableau_preview.png)

_Gambar 1. Pratinjau antarmuka dashboard. Berkas gambar disimpan pada folder `docs/images/`._

## 4. Spesifikasi Fungsional

### 4.1 Komponen Visualisasi

| Kode | Komponen                | Jenis Visualisasi                                               | Deskripsi                                                                                                                       |
| ---- | ----------------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| V-01 | Peta distribusi spasial | Peta koroplet (_choropleth_)                                    | Persebaran PDRB, PDRB Hijau, deforestasi, dan konsentrasi PM2.5 pada 34 provinsi periode 2010–2025, berdasarkan data olahan GEE |
| V-02 | Ringkasan metrik        | Kartu indikator kinerja utama (_key performance indicator_/KPI) | Total cakupan area dan tren statistik utama                                                                                     |

### 4.2 Fitur Interaktif

| Kode | Fitur            | Keterangan                                   |
| ---- | ---------------- | -------------------------------------------- |
| F-01 | Filter tahun     | Menyaring data berdasarkan rentang waktu     |
| F-02 | Filter wilayah   | Menyaring data berdasarkan provinsi          |
| F-03 | Filter indikator | Memilih indikator yang ditampilkan pada peta |

## 5. Definisi Indikator

| Indikator   | Definisi Operasional                                                                                                                                                                                                                                         | Satuan                                      | Sumber Data                                        |
| ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------- | -------------------------------------------------- |
| PDRB        | Nilai tambah bruto seluruh kegiatan ekonomi yang dihasilkan suatu provinsi pada periode tertentu, sebelum memperhitungkan kerusakan lingkungan.                                                                                                              | `[miliar]`                                  | Badan Pusat Statistik (BPS)                        |
| PDRB Hijau  | PDRB yang telah disesuaikan dengan mengurangkan nilai moneter kerusakan lingkungan, yaitu biaya deforestasi dan biaya polusi udara PM2.5: PDRB Hijau = PDRB − (biaya deforestasi + biaya PM2.5).                                                             | `[miliar]`                                  | Diolah                                             |
| Deforestasi | Hilangnya tutupan hutan pada suatu provinsi pada periode tertentu, diukur dari data citra satelit. Luasnya dinilai secara moneter dengan pendekatan _Social Cost of Carbon_ (SCC), yaitu emisi karbon yang dilepaskan dikalikan biaya sosial per ton karbon. | Hektare (luas); rupiah (nilai moneter)      | Google Earth Engine, `[nama dataset dan resolusi]` |
| PM2.5       | Konsentrasi rata-rata tahunan partikel udara berdiameter ≤ 2,5 mikrometer pada suatu provinsi. Dampak kesehatannya dinilai secara moneter dengan pendekatan _Value of Statistical Life_ (VSL).                                                               | µg/m³ (konsentrasi); rupiah (nilai moneter) | Google Earth Engine, `[nama dataset dan resolusi]` |

## 6. Panduan Penggunaan

1. Buka tautan dashboard melalui peramban.
2. Tunggu hingga dashboard selesai dimuat (_render_).
3. Atur filter tahun atau indikator pada panel di sisi kiri dashboard.
4. Amati perubahan peta choropleth dan ringkasan KPI sesuai pilihan filter.
5. Arahkan kursor ke wilayah pada peta untuk melihat nilai indikator secara rinci.

## 7. Keterbatasan

- Dashboard dipublikasikan pada Tableau Public.
- Dashboard bersifat deskriptif-eksploratif. Hasil estimasi inferensial (misalnya model GMM panel dinamis) disajikan pada laporan skripsi, bukan pada dashboard ini.
- Pembaruan data memerlukan proses ulang pada GEE dan Colab, kemudian publikasi ulang ke Tableau Public.

## 8. Riwayat Revisi

| Versi | Tanggal      | Perubahan                                      |
| ----- | ------------ | ---------------------------------------------- |
| 1.0   | Oktober 2026 | Publikasi dashboard dan penyusunan dokumentasi |
