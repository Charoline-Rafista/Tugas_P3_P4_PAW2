require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const transaksiRoutes = require("./routes/transaksiRoutes");
const { notFoundHandler, errorHandler } = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "FinTrack RESTful API aktif", endpoints: ["/api/transaksi"] });
});

app.use("/api/transaksi", transaksiRoutes);

// Harus diletakkan setelah routes agar menangani route yang tidak ditemukan dan error API.
app.use(notFoundHandler);
app.use(errorHandler);

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI belum diatur. Salin .env.example menjadi .env lalu isi koneksi MongoDB.");
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("Terhubung ke MongoDB");
    app.listen(PORT, () => console.log(`FinTrack berjalan di http://localhost:${PORT}`));
  } catch (error) {
    console.error("Gagal menjalankan FinTrack:", error.message);
    process.exit(1);
  }
}

if (require.main === module) startServer();
module.exports = app;
