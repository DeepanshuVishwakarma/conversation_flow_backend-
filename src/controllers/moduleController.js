const Module = require("../models/Module");
const User = require("../models/User");
const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");

exports.switchModule = async (req, res, next) => {
  try {
    const { moduleId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const module = await Module.findOne({ moduleId });
    if (!module) {
      return next(new AppError("Module not found", status_code.NOT_FOUND));
    }

    user.activeState = {
      moduleId,
      currentQuestion: module.rootQuestion,
    };

    await user.save();

    res.status(status_code.SUCCESS).json({ msg: "Switched module", module });
  } catch (err) {
    next(err);
  }
};

exports.getAllModules = async (req, res, next) => {
  try {
    const modules = await Module.find({})
      .populate("rootQuestion")
      .populate("questions");

    res.status(status_code.SUCCESS).json({ modules });
  } catch (err) {
    next(err);
  }
};

exports.getModuleHistory = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const user = await User.findById(req.user.id).select("history");
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    // A user may have multiple history entries for the same module;
    // merge all question records and sort oldest -> newest.
    const moduleQuestions = user.history
      .filter((entry) => entry.moduleId === moduleId)
      .flatMap((entry) => entry.questions || [])
      .sort((a, b) => new Date(a.answeredAt || 0) - new Date(b.answeredAt || 0));

    res.status(status_code.SUCCESS).json({
      moduleId,
      chatHistory: moduleQuestions,
    });
  } catch (err) {
    next(err);
  }
};