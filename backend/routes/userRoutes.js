const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,
  getWishlist,
  addToWishlist,
  removeFromWishlist,
  getVendors,
  approveVendor,
  rejectVendor,
  getProfile,
  updateProfile,
  changePassword,
} = require("../controllers/userController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

/* ===========================
   Customer Routes
=========================== */

router.get("/wishlist", protect, getWishlist);

router.post(
  "/wishlist/:productId",
  protect,
  authorize("customer"),
  addToWishlist
);

router.delete(
  "/wishlist/:productId",
  protect,
  authorize("customer"),
  removeFromWishlist
);

/* ===========================
   Customer Profile
=========================== */

router.get(
  "/profile",
  protect,
  getProfile
);

router.put(
  "/profile",
  protect,
  upload.single("profileImage"),
  updateProfile
);

router.put(
  "/change-password",
  protect,
  changePassword
);

/* ===========================
   Vendor Approval
=========================== */

router.get(
  "/vendors",
  protect,
  authorize("admin"),
  getVendors
);

router.put(
  "/vendors/:id/approve",
  protect,
  authorize("admin"),
  approveVendor
);

router.put(
  "/vendors/:id/reject",
  protect,
  authorize("admin"),
  rejectVendor
);

/* ===========================
   Admin Routes
=========================== */

router.get(
  "/",
  protect,
  authorize("admin"),
  getUsers
);

router.get(
  "/:id",
  protect,
  authorize("admin"),
  getUser
);

router.put(
  "/:id/role",
  protect,
  authorize("admin"),
  updateUserRole
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteUser
);

module.exports = router;