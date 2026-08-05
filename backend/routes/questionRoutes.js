const express = require("express");

const {
  askQuestion,
  getProductQuestions,
  answerQuestion,
  deleteQuestion,
  getVendorQuestions,
  getAllQuestions,
} = require("../controllers/questionController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/products/:id/questions",
  getProductQuestions
);

router.post(
  "/products/:id/questions",
  protect,
  authorize("customer"),
  askQuestion
);

router.put(
  "/:id/answer",
  protect,
  authorize("vendor", "admin"),
  answerQuestion
);

router.delete(
  "/:id",
  protect,
  authorize("customer", "admin"),
  deleteQuestion
);

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  getVendorQuestions
);

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllQuestions
);

module.exports = router;