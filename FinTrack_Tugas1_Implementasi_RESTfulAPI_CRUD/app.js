const express = require("express");
const app = express();
const PORT = 3000;

app.use(express.json());

let transaksi = [
  { id: 1, judul: "Uang Saku Bulanan", jumlah: 1500000, tipe: "Pemasukan", kategori: "Transfer"},
  { id: 2, judul: "Beli Buku Kuliah", jumlah: 500000, tipe: "Pengeluaran", kategori: "Kuliah"},
  { id: 3, judul: "Beli Makan Siang", jumlah: 50000, tipe: "Pengeluaran", kategori: "Makanan"},
  { id: 4, judul: "Gaji", jumlah: 2000000, tipe: "Pemasukan", kategori: "Transfer"},
];

// TODO 1: GET /transaksi -> kirim seluruh data sebagai JSON
app.get("/transaksi", (req, res) => {
  res.json(transaksi);
});

// TODO 2: GET /transaksi/:id -> cari data berdasarkan id,
// kirim 404 dengan { message: 'Data tidak ditemukan' } jika tidak ada
app.get("/transaksi/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const data = transaksi.find((m) => m.id === id);
  if (!data) return res.status (404).json({message: 'Data tidak ditemukan'});
  res.json(data);
});

// TODO 3: POST /transaksi -> ambil { judul, jumlah } dari req.body,
// buat objek baru dengan id = transaksi.length + 1, simpan ke array,
// kirim response dengan status 201
app.post("/transaksi", (req, res) => {
  const {judul, jumlah} = req.body;

  const baru = {
    id: transaksi.length + 1,
    judul,
    jumlah,
  };

  transaksi.push(baru);
  res.status(201).json(baru);
});

// TODO 4: PUT /transaksi/:id -> cari index berdasarkan id,
// jika tidak ditemukan kirim 404, jika ditemukan gabungkan data lama
// dengan req.body lalu kirim data yang telah diperbarui
app.put("/transaksi/:id", (req, res) => {
  const id = parseInt (req.params.id);
  const index = transaksi.findIndex((m) => m.id === id);

  if (index === -1){
    return res.status(404).json({message: 'Data tidak ditemukan'});

    transaksi[index] = {...transaksi[index], ...req.body};
    res.json(transaksi[index]);
  }
});

// TODO 5: DELETE /transaksi/:id -> cari index berdasarkan id,
// jika tidak ditemukan kirim 404, jika ditemukan hapus dari array
// dan kirim response dengan status 204
app.delete("/transaksi/:id", (req, res) => {
  // lengkapi di sini
  const id = parseInt(req.params.id);
  const index = transaksi.findIndex((m) => m.id === id);

  if(index === -1) {
    return res.status(404).json({message: 'Data tidak ditemukan'});
  }

  transaksi.splice(index,1);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});



