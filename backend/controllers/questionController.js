const Question = require("../models/Question");
const Product = require("../models/Product");

const askQuestion = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const question = await Question.create({
      product: product._id,
      customer: req.user._id,
      vendor: product.vendor,
      question: req.body.question,
    });

    res.status(201).json({
      success: true,
      message: "Question submitted successfully",
      data: question,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      product: req.params.id,
      isActive: true,
    })
      .populate("customer", "name")
      .populate("answer.answeredBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const answerQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (
      req.user.role === "vendor" &&
      question.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    question.answer = {
      text: req.body.answer,
      answeredBy: req.user._id,
      answeredRole:
        req.user.role === "admin"
          ? "admin"
          : "vendor",
      answeredAt: new Date(),
    };

    question.status = "Answered";

    await question.save();

    const updated = await Question.findById(question._id)
      .populate("customer", "name")
      .populate("answer.answeredBy", "name");

    res.json({
      success: true,
      message: "Answer submitted successfully",
      data: updated,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id);

    if (!question) {
      return res.status(404).json({
        success: false,
        message: "Question not found",
      });
    }

    if (
      req.user.role === "customer" &&
      question.customer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    question.isActive = false;

    await question.save();

    res.json({
      success: true,
      message: "Question deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      vendor: req.user._id,
      isActive: true,
    })
      .populate("product", "name")
      .populate("customer", "name")
      .populate("answer.answeredBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllQuestions = async (req, res) => {
  try {
    const questions = await Question.find({
      isActive: true,
    })
      .populate("product", "name")
      .populate("customer", "name")
      .populate("vendor", "name shopName")
      .populate("answer.answeredBy", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: questions.length,
      data: questions,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  askQuestion,
  getProductQuestions,
  answerQuestion,
  deleteQuestion,
  getVendorQuestions,
  getAllQuestions,
};