# ANALISIS PRODUK DOMESTIK REGIONAL BRUTO HIJAU (PDRB HIJAU) 34 PROVINSI DI INDONESIA PERIODE 2010–2025

**Pendekatan Citra Satelit dan Panel Dinamis**

## Identitas

| Atribut | Keterangan |
|---|---|
| Nama | Febrina Br Perangin-Angin |
| NIM | 222212608 |
| Program Studi | Komputasi Statistik |
| Dosen Pembimbing | Anugerah Karta Monika, S.Si., M.E. |
| Tahun | 2026 |

## Deskripsi

Penelitian ini menghitung PDRB Hijau 34 provinsi di Indonesia periode 2010–2025 dengan mengurangkan nilai moneter degradasi lingkungan, yaitu deforestasi (dengan metode valuasi *Social Cost of Carbon*) dan polusi udara PM2.5 (dengan metode valuasi *Value of Statistical Life* dan *Disability-Adjusted Life Years* sebagai pembanding), ke PDRB konvensional. Faktor-faktor makroekonomi yang memengaruhi PDRB Hijau dianalisis dengan model panel dinamis GMM. Data yang digunakan berasal dari citra satelit *Moderate Resolution Imaging Spectroradiometer* (MODIS), *Global Forest Watch* (GFW), dan integrasi model *Atmospheric Composition Analysis Group* (ACAG) melalui platform Google Earth Engine (GEE)(Google Earth Engine),  serta publikasi BPS. Hasil analisis disajikan melalui dashboard interaktif berbasis Tableau Public.

## Gambaran Sistem

```
Citra Satelit (GEE) → Valuasi Lingkungan → PDRB Hijau + Data BPS → Panel Dinamis (GMM) → Dashboard
```

1. **Akuisisi dan pemrosesan data:** pengambilan data PM2.5, NDVI, LST, dan ERA5 melalui GEE, data deforestasi melalui GFW, data kematian melalui ACAG, serta penyiapan data PDRB dan variabel makroekonomi dari BPS.
2. **Valuasi dan perhitungan PDRB Hijau:** penilaian moneter deforestasi (SCC) dan konsentrasi PM2.5 (VSL), lalu dikurangkan dari PDRB.
3. **Pemodelan:** penyusunan panel akhir dan estimasi panel dinamis GMM.
4. **Visualisasi:** penyajian peta *choropleth* dan ringkasan indikator pada dashboard berbasis Tableau Public.

## Struktur Repositori

```
.
├── README.md
├── Artefact/        # tautan dasbor Tableau Public
├── Dataset/         # data penelitian (CSV)
├── Dokumentasi/     # dokumentasi sistem dan panduan penggunaan
└── SourceCode/      # akuisisi data (GEE), valuasi, dan pengolahan panel
```

| Folder | Isi utama |
|---|---|
| `Artefact/` | `tableau_links.md` |
| `Dataset/` | Data mentah per variabel (PDRB, PMTB, IPM, tenaga kerja, deforestasi, dan lainnya) serta panel olahan (`master_panel_pdrb_hijau_2010_2025.csv`, `panel_final_gmm_tahap1.csv`) |
| `Dokumentasi/` | `dokumentasi_panduan.md` dan folder `images/` |
| `SourceCode/` | `PM25.js`, `NDVI.js`, `LST.js`, `ERA5.js`, `Carbon_Price.ipynb`, `ValuasiPM25.ipynb`, `FullPanel3.ipynb`, `GreenPDRB.ipynb`, `CrossCheck.ipynb` |

Data batas wilayah provinsi (Dukcapil, Desember 2019) tidak disimpan di repositori dan dapat diunduh melalui [Google Drive](https://drive.google.com/drive/folders/1nKzI9HcL5rdT9jHo9bRqpKcWPzJQkqyT?usp=sharing).

## Dataset

| Data | Sumber | Status |
|---|---|---|
| NDVI | Google Earth Engine (MODIS/061/MOD13Q1) | Terbuka untuk publik |
| LST | Google Earth Engine (MODIS/061/MOD11A2) | Terbuka untuk publik |
| AOD | Google Earth Engine (MODIS/061/MCD19A2_GRANULES) | Terbuka untuk publik |
| PM2.5 | ACAG/Washington University | Terbuka untuk publik |
| Deforestasi | Global Forest Watch | Terbuka untuk publik |
| Harga karbon (SCC) dan fluks karbon hutan | Interagency Working Group (2016); Harris et al. (2021) | Terbuka untuk publik |
| Kematian dan DALY PM2.5 | Global Burden of Disease (IHME, GBD 2023) | Terbuka untuk publik |
| PDRB ADHK, PDRB per kapita, PMTB, IPM | BPS (Publikasi) | Terbuka untuk publik |
| Tenaga kerja | BPS (Sakernas) | Terbuka untuk publik |

## Kebutuhan Sistem

- Google Colab (Python 3.x) untuk menjalankan berkas [.ipynb], termasuk estimasi GMM
- Pustaka utama: [pydynpd]
- Akun Google Earth Engine untuk menjalankan ulang akuisisi citra
- Tableau Public: dasbor dapat dibuka langsung melalui peramban web tanpa memasang Tableau dan tanpa akun

## Cara Menjalankan

### 1. Pengolahan dan Pemodelan

```bash
git clone https://github.com/Angin23/skripsi_2026.git
cd skripsi_2026
```

Jalankan berkas di `SourceCode/` secara berurutan:

| Urutan | Berkas | Fungsi |
|---|---|---|
| 1 | `PM25.js`, `NDVI.js`, `LST.js`, `ERA5.js` | Akuisisi data satelit dan iklim di Google Earth Engine |
| 2 | `Carbon_Price.ipynb` | Penentuan harga karbon dan valuasi deforestasi (SCC) |
| 3 | `ValuasiPM25.ipynb` | Valuasi dampak PM2.5 (VSL) |
| 4 | `GreenPDRB.ipynb` | Perhitungan PDRB Hijau |
| 5 | `FullPanel3.ipynb` | Penyusunan panel data lengkap |
| 6 | `CrossCheck.ipynb` | Verifikasi silang hasil perhitungan |

### 2. Dashboard Interaktif

Dashboard dipublikasikan di Tableau Public dan tidak memerlukan instalasi.

1. Buka [dashboard PDRB Hijau](https://public.tableau.com/app/profile/febrina.angin/viz/AnalisisPDRBHijau_ArtefakSkripsi/Dashboard3) melalui peramban.
2. Tunggu hingga dashboard selesai dimuat.
3. Gunakan filter tahun dan indikator di sisi kiri untuk mengeksplorasi data.

Fitur dashboard: peta *choropleth* PDRB, PDRB Hijau, deforestasi, dan PM2.5 untuk 34 provinsi periode 2010–2025, filter interaktif, serta ringkasan metrik.

## Hasil Keluaran

| Keluaran | Lokasi |
|---|---|
| Nilai moneter deforestasi dan PM2.5 | `Dataset/panel_deforestasi_nilai_rupiah_2010_2025.csv`, `Dataset/panel_nilai_pm25_lengkap_2010_2025.csv` |
| PDRB Hijau dan panel induk | `Dataset/master_panel_pdrb_hijau_2010_2025.csv` |
| Panel untuk estimasi GMM | `Dataset/panel_final_gmm_tahap1.csv` |
| Dashboard interaktif | `Artefact/tableau_links.md` |

## Dokumentasi

Panduan lengkap penggunaan dan definisi indikator tersedia di `Dokumentasi/dokumentasi_panduan.md`.

## Pemecahan Masalah

| Masalah | Solusi |
|---|---|
| Jalur data tidak ditemukan | Sesuaikan jalur pada sel konfigurasi notebook |
| Pustaka tidak terpasang | Jalankan `pip install [nama-pustaka]` |
| Skrip GEE tidak berjalan | Pastikan akun Google Earth Engine aktif dan terautentikasi |
| Dashboard tidak tampil | Buka melalui peramban modern dengan koneksi internet stabil |

## Catatan

- Data batas wilayah provinsi tersedia melalui tautan Google Drive pada bagian Struktur Repositori.
- Data citra satelit dapat diunduh ulang melalui Google Earth Engine.
