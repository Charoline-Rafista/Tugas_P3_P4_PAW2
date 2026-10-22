const mongoose = require("mongoose");

const transaksiSchema = new mongoose.Schema(
  {
    judul: { type: String, required: [true, "Judul transaksi wajib diisi"], trim: true },
    jumlah: { type: Number, required: [true, "Jumlah transaksi wajib diisi"], min: [0, "Jumlah tidak boleh negatif"] },
    tipe: { type: String, required: [true, "Tipe transaksi wajib diisi"], enum: ["Pemasukan", "Pengeluaran"] },
    kategori: { type: String, required: [true, "Kategori transaksi wajib diisi"], trim: true }
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Transaksi", transaksiSchema);
