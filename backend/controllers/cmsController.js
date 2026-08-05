const CMSPage = require("../models/CMSPage");
const logActivity = require("../utils/logActivity");

exports.getPages = async (req, res) => {
  try {
    const pages = await CMSPage.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: pages,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getPageBySlug = async (req, res) => {
  try {
    const page = await CMSPage.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    res.json({
      success: true,
      data: page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.createPage = async (req, res) => {
  try {
    const page = await CMSPage.create(req.body);

    await logActivity(
      req.user,
      "CMS Page Created",
      `${page.title} page was created`
    );

    res.status(201).json({
      success: true,
      data: page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updatePage = async (req, res) => {
  try {
    const page = await CMSPage.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    await logActivity(
      req.user,
      "CMS Page Updated",
      `${page.title} page was updated`
    );

    res.json({
      success: true,
      data: page,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deletePage = async (req, res) => {
  try {
    const page = await CMSPage.findById(req.params.id);

    if (!page) {
      return res.status(404).json({
        success: false,
        message: "Page not found",
      });
    }

    const pageTitle = page.title;

    await page.deleteOne();

    await logActivity(
      req.user,
      "CMS Page Deleted",
      `${pageTitle} page was deleted`
    );

    res.json({
      success: true,
      message: "Page deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};