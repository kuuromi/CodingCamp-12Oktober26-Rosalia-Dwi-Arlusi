# Daymark — Life Dashboard

Dashboard produktivitas sederhana menggunakan HTML, CSS, dan JavaScript vanilla (tanpa framework).

## Fitur
- Jam real-time, tanggal, dan sapaan berdasarkan waktu.
- Nama panggilan tersimpan di browser.
- Focus timer 25 menit dengan mulai, jeda, dan ulangi.
- To-do list: tambah, tandai selesai, hapus, bersihkan tugas selesai, dan pencegahan duplikat tugas aktif.
- Quick links: tambah dan hapus tautan favorit.
- Mode terang/gelap.
- Data tugas, tautan, nama, dan tema tersimpan di `localStorage`.
- Responsif untuk ponsel dan desktop.

## Struktur folder
```text
daymark-life-dashboard/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js
└── README.md
```

## Menjalankan secara lokal
Cukup buka `index.html` di browser. Untuk pengembangan, bisa juga memakai ekstensi Live Server di VS Code.

## Deploy dengan GitHub Pages
1. Buat akun atau masuk ke https://github.com.
2. Klik **New repository**. Beri nama misalnya `daymark-life-dashboard`.
3. Pilih **Public**, lalu klik **Create repository**.
4. Di halaman repository, pilih **Add file → Upload files**.
5. Unggah `index.html`, folder `css` beserta `style.css`, folder `js` beserta `script.js`, dan `README.md`. Pastikan `index.html` berada di root repository.
6. Klik **Commit changes**.
7. Buka **Settings → Pages**.
8. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
9. Pada **Branch**, pilih `main` dan folder `/(root)`, lalu klik **Save**.
10. Tunggu proses deploy selesai. URL biasanya berbentuk `https://USERNAME.github.io/daymark-life-dashboard/`. Ganti `USERNAME` dengan username GitHub-mu.
11. Jika halaman belum muncul, tunggu beberapa menit lalu refresh. Pastikan nama file dan huruf besar/kecil pada path CSS/JS sama persis.

## Catatan
- Google Fonts memerlukan koneksi internet. Jika font tidak dapat dimuat, situs tetap menggunakan font fallback.
- `localStorage` hanya tersimpan di browser/perangkat yang sedang dipakai, bukan tersinkron ke akun GitHub.
- Jangan memasukkan informasi pribadi atau rahasia ke dashboard yang dipublikasikan.
