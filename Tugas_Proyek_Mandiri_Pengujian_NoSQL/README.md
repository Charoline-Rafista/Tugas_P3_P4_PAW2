# FinTrack RESTful API

FinTrack adalah RESTful API pencatatan transaksi menggunakan Express.js, MongoDB, dan Mongoose. Struktur dibuat terpisah menjadi `models/`, `controllers/`, `routes/`, dan `middleware/` seperti pola project Pertemuan 9–10.

## Fitur tugas

1. **Filtering**: filter dengan `tipe`, `kategori`, dan pencarian `search`.
2. **Pagination**: parameter `page` dan `limit`; batas `limit` maksimal 100.
3. **Sorting**: parameter `sortBy` dan `order`.
4. **Projection**: parameter `fields` memilih field respons.
5. **Error handling terpusat**: seluruh error diteruskan ke middleware `errorHandler`.

## Langkah menjalankan

1. Pastikan Node.js dan npm terpasang.
2. Ekstrak ZIP, lalu buka folder `FinTrack` di VS Code.
3. Buka terminal pada folder yang berisi `package.json`.
4. Jalankan `npm install`.
5. Salin `.env.example` menjadi `.env`.
   - Windows PowerShell: `Copy-Item .env.example .env`
   - CMD: `copy .env.example .env`
6. Buat database MongoDB Atlas (atau MongoDB lokal), lalu isi `MONGODB_URI` pada `.env` dengan connection string milik Anda. Ganti `USERNAME`, `PASSWORD`, dan `cluster-url`; jangan membagikan file `.env`.
7. Jalankan server dengan `npm run dev` atau `npm start`.
8. Uji endpoint memakai Thunder Client/Postman.

## Endpoint CRUD

- `GET /api/transaksi` — daftar transaksi
- `GET /api/transaksi/:id` — detail transaksi
- `POST /api/transaksi` — tambah transaksi
- `PUT /api/transaksi/:id` — ubah transaksi
- `DELETE /api/transaksi/:id` — hapus transaksi

## Contoh query untuk fitur tugas

- Filtering: `GET /api/transaksi?tipe=Pengeluaran`
- Filter kategori: `GET /api/transaksi?kategori=Makanan`
- Pencarian judul: `GET /api/transaksi?search=buku`
- Pagination: `GET /api/transaksi?page=1&limit=5`
- Sorting: `GET /api/transaksi?sortBy=jumlah&order=desc`
- Projection: `GET /api/transaksi?fields=judul,jumlah,kategori`
- Gabungan: `GET /api/transaksi?tipe=Pengeluaran&page=1&limit=5&sortBy=jumlah&order=desc&fields=judul,jumlah,kategori`

`sortBy` yang diizinkan: `judul`, `jumlah`, `tipe`, `kategori`, `createdAt`, `updatedAt`.
`fields` yang diizinkan: `judul`, `jumlah`, `tipe`, `kategori`, `createdAt`, `updatedAt`.
`limit` maksimum adalah 100.

## Contoh body POST/PUT

```json
{
  "judul": "Beli makan siang",
  "jumlah": 50000,
  "tipe": "Pengeluaran",
  "kategori": "Makanan"
}
```

## Contoh response GET daftar

```json
{
  "success": true,
  "data": [],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 0,
    "totalPages": 0,
    "hasNextPage": false,
    "hasPrevPage": false
  },
  "sorting": {
    "sortBy": "createdAt",
    "order": "desc"
  }
}
```

Catatan: database baru akan menghasilkan daftar kosong sampai transaksi ditambahkan. MongoDB connection string wajib diisi pada `.env`.
