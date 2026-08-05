const express = require("express");

const {
  getPages,
  getPageBySlug,
  createPage,
  updatePage,
  deletePage,
} = require("../controllers/cmsController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, authorize("admin"), getPages);

router.post("/", protect, authorize("admin"), createPage);

router.put("/:id", protect, authorize("admin"), updatePage);

router.delete("/:id", protect, authorize("admin"), deletePage);

router.get("/page/:slug", getPageBySlug);

module.exports = router;