# Deep Talk for You — versi rekonstruksi

Website statis yang bisa dipublikasikan melalui GitHub Pages.

## Isi folder
- `index.html` — struktur halaman
- `style.css` — desain responsif
- `script.js` — 10 pertanyaan, navigasi, hasil refleksi, WhatsApp, dan efek suara klik
- `assets/music/background.mp3` — tempat menaruh musik latar (opsional)

## Menjalankan
Buka `index.html` di browser atau unggah seluruh isi folder ini ke repository GitHub.

## Publikasi GitHub Pages
1. Buat repository baru.
2. Unggah semua file dan folder di dalam proyek ini.
3. Buka **Settings → Pages**.
4. Pada **Build and deployment**, pilih **Deploy from a branch**.
5. Pilih branch `main` dan folder `/ (root)`, lalu Save.

Catatan:
- Musik latar belum disertakan. Letakkan file MP3 milikmu di `assets/music/` dengan nama `background.mp3`.
- Tombol WhatsApp menggunakan fitur berbagi WhatsApp (`wa.me/?text=`), sehingga pengguna dapat memilih kontak Shofiyaa sendiri.
- Persentase hasil adalah ringkasan refleksi sederhana yang dibuat untuk versi rekonstruksi, bukan skor psikologis dan belum tentu sama dengan algoritma website asli.


## Animasi dan suara klik
- Animasi bunga/emoji melayang, transisi kartu, dan efek hover sudah aktif melalui `style.css`.
- Efek suara klik dibuat menggunakan Web Audio API di `script.js`, jadi tidak memerlukan file audio tambahan. Suara mulai aktif setelah pengunjung berinteraksi dengan halaman.
- Tombol musik latar tetap opsional dan memerlukan file `assets/music/background.mp3` jika ingin digunakan.
