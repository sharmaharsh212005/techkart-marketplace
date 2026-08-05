const express = require("express");

const {
  createEnquiry,
  getCustomerEnquiries,
  getVendorEnquiries,
  replyToEnquiry,
  closeEnquiry,
  deleteEnquiry,
  getAllEnquiries,
} = require("../controllers/enquiryController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


router.post(
  "/",
  protect,
  authorize("customer"),
  createEnquiry
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  getCustomerEnquiries
);

router.patch(
  "/:id/close",
  protect,
  authorize("customer"),
  closeEnquiry
);


router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  getVendorEnquiries
);

router.patch(
  "/:id/reply",
  protect,
  authorize("vendor"),
  replyToEnquiry
);

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAllEnquiries
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteEnquiry
);

module.exports = router;