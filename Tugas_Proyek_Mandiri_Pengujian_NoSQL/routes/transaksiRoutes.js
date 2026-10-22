const express = require("express");
const controller = require("../controllers/transaksiController");
const router = express.Router();

router.route("/")
  .get(controller.getTransaksi)
  .post(controller.createTransaksi);

router.route("/:id")
  .get(controller.getTransaksiById)
  .put(controller.updateTransaksi)
  .delete(controller.deleteTransaksi);

module.exports = router;
