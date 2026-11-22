# FOR-CLASS IX · CLASS-AI

Website kreatif dengan CLASS-AI, IQC Maker, Fake FF, Fake ML, dan About Class IX.

## Isi project
- `index.html`, `style.css`, `script.js`: tampilan dan navigasi.
- `js/`: logika fitur frontend.
- `api/chat.js`: backend aman untuk OpenAI API.
- `assets/`: dua template gambar yang dikirim pengguna.

## Jalankan lokal
1. Install Node.js.
2. Install Vercel CLI: `npm i -g vercel`
3. Buka terminal di folder project.
4. Jalankan `npm install` lalu `vercel dev`.
5. Buka alamat lokal yang ditampilkan Vercel CLI.

Untuk menguji AI secara lokal, buat file `.env` (jangan upload ke GitHub):
```
OPENAI_API_KEY=isi_api_key_di_sini
OPENAI_MODEL=gpt-4.1-mini
```

## Deploy ke Vercel
1. Upload folder project ke repository GitHub.
2. Masuk ke https://vercel.com dan pilih Add New → Project.
3. Import repository GitHub tersebut.
4. Di Project Settings → Environment Variables, tambahkan:
   - `OPENAI_API_KEY` = API key OpenAI milikmu
   - `OPENAI_MODEL` = `gpt-4.1-mini` (bisa diganti ke model yang tersedia di akun API)
5. Deploy. Jika mengubah Environment Variables, lakukan redeploy.

**Keamanan:** jangan pernah menaruh API key di `index.html`, `script.js`, atau file frontend. Jangan kirim API key ke chat dan jangan commit file `.env`.

## Catatan fitur
- Riwayat CLASS-AI disimpan di localStorage browser perangkat ini.
- IQC Maker menghasilkan PNG mockup dari input chat. Tampilan preview dan PNG dibuat sebagai ilustrasi, bukan replika bukti percakapan.
- Fake FF dan Fake ML menambahkan label custom di atas gambar template yang disediakan. Hasilnya mockup dan tidak mengubah akun/game.
- Untuk mengganti template, ganti file di `assets/` dengan nama dan format yang sama.
