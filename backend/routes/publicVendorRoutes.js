const express = require("express");

const {
  getAllVendors,
  getVendorStore
} = require("../controllers/publicVendorController");

const router = express.Router();

router.get("/", getAllVendors);

router.get("/:id", getVendorStore);

module.exports = router;