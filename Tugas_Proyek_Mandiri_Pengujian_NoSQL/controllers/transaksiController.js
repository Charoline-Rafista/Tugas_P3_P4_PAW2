const Transaksi = require("../models/transaksiModel");
const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// GET /api/transaksi?tipe=Pengeluaran&kategori=Makanan&page=1&limit=10&sortBy=jumlah&order=desc&fields=judul,jumlah
exports.getTransaksi = asyncHandler(async (req, res) => {
  const { tipe, kategori, search, page = "1", limit = "10", sortBy = "createdAt", order = "desc", fields } = req.query;

  const pageNum = Number.parseInt(page, 10);
  const limitNum = Number.parseInt(limit, 10);
  const allowedSort = ["judul", "jumlah", "tipe", "kategori", "createdAt", "updatedAt"];
  const allowedFields = ["judul", "jumlah", "tipe", "kategori", "createdAt", "updatedAt"];

  if (!Number.isInteger(pageNum) || pageNum < 1) {
    const error = new Error("Query page harus berupa bilangan bulat minimal 1");
    error.statusCode = 400; throw error;
  }
  if (!Number.isInteger(limitNum) || limitNum < 1) {
    const error = new Error("Query limit harus berupa bilangan bulat minimal 1");
    error.statusCode = 400; throw error;
  }
  if (limitNum > 100) {
    const error = new Error("Query limit maksimal 100");
    error.statusCode = 400; throw error;
  }
  if (!allowedSort.includes(sortBy)) {
    const error = new Error(`sortBy tidak valid. Pilihan: ${allowedSort.join(", ")}`);
    error.statusCode = 400; throw error;
  }
  if (!["asc", "desc"].includes(order.toLowerCase())) {
    const error = new Error("order hanya boleh asc atau desc");
    error.statusCode = 400; throw error;
  }

  const filter = {};
  if (tipe) filter.tipe = tipe;
  if (kategori) filter.kategori = new RegExp(escapeRegex(kategori), "i");
  if (search) filter.judul = new RegExp(escapeRegex(search), "i");

  const sort = { [sortBy]: order.toLowerCase() === "asc" ? 1 : -1 };
  const projection = {};
  if (fields) {
    const requestedFields = fields.split(",").map((f) => f.trim()).filter(Boolean);
    const invalidFields = requestedFields.filter((f) => !allowedFields.includes(f));
    if (invalidFields.length) {
      const error = new Error(`Field projection tidak valid: ${invalidFields.join(", ")}`);
      error.statusCode = 400; throw error;
    }
    requestedFields.forEach((field) => { projection[field] = 1; });
  }

  const [data, total] = await Promise.all([
    Transaksi.find(filter, projection).sort(sort).skip((pageNum - 1) * limitNum).limit(limitNum).lean(),
    Transaksi.countDocuments(filter)
  ]);

  res.json({
    success: true,
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      totalPages: Math.ceil(total / limitNum),
      hasNextPage: pageNum * limitNum < total,
      hasPrevPage: pageNum > 1
    },
    sorting: { sortBy, order: order.toLowerCase() },
    ...(fields ? { projection: fields.split(",").map((f) => f.trim()).filter(Boolean) } : {})
  });
});

exports.getTransaksiById = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.findById(req.params.id);
  if (!transaksi) {
    const error = new Error("Data transaksi tidak ditemukan");
    error.statusCode = 404; throw error;
  }
  res.json({ success: true, data: transaksi });
});

exports.createTransaksi = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.create(req.body);
  res.status(201).json({ success: true, message: "Transaksi berhasil ditambahkan", data: transaksi });
});

exports.updateTransaksi = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.findByIdAndUpdate(req.params.id, req.body, {
    new: true, runValidators: true
  });
  if (!transaksi) {
    const error = new Error("Data transaksi tidak ditemukan");
    error.statusCode = 404; throw error;
  }
  res.json({ success: true, message: "Transaksi berhasil diperbarui", data: transaksi });
});

exports.deleteTransaksi = asyncHandler(async (req, res) => {
  const transaksi = await Transaksi.findByIdAndDelete(req.params.id);
  if (!transaksi) {
    const error = new Error("Data transaksi tidak ditemukan");
    error.statusCode = 404; throw error;
  }
  res.status(200).json({ success: true, message: "Transaksi berhasil dihapus", data: transaksi });
});

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
