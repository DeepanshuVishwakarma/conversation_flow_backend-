const Question = require("../models/Question");
const Module = require("../models/Module");
const User = require("../models/User");
const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");

exports.getQuestion = async (req, res, next) => {
  try {
    const { moduleId } = req.params;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const moduleData = await Module.findOne({
      module_id: moduleId,
    }).populate("startQuestion");

    if (!moduleData) {
      return next(new AppError("Module not found", status_code.NOT_FOUND));
    }

    let startQuestion = moduleData.startQuestion;

    if (!startQuestion) {
      return next(new AppError("Start question not found", status_code.NOT_FOUND));
    }

    res.status(status_code.SUCCESS).json({
      module: {
        name: moduleData.name,
        moduleId: moduleData.module_id,
      },
      startQuestion,
    });
  } catch (err) {
    next(err);
  }
};
exports.nextQuestion = async (req, res, next) => {
  try {
    const { currentQuestionId, answer, moduleId } = req.body;

    const user = await User.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const question = await Question.findById(currentQuestionId);
    if (!question) {
      return next(new AppError("Question not found", status_code.NOT_FOUND));
    }

    if (!question.options[answer]) {
      return next(new AppError("Invalid option", status_code.BAD_REQUEST));
    }

    const nextQId = question.options[answer].nextQuestion;

    const nextQuestion = await Question.findById(nextQId);
    if (!nextQuestion) {
      return next(new AppError("Next question not found", status_code.NOT_FOUND));
    }

    user.activeState = {
      moduleId,
      currentQuestion: nextQId,
    };

    user.history.push({
      moduleId,
      questions: [
        {
          questionId: question._id,
          question: question.question,
          selectedOption: answer,
          answeredAt: new Date(),
        },
      ],
    });

    await user.save();

    res.status(status_code.SUCCESS).json({
      nextQuestion: {
        _id: nextQuestion._id,
        question: nextQuestion.question,
        options: Object.keys(nextQuestion.options),
        isCheckPoint: nextQuestion.isCheckPoint,
      },
    });
  } catch (err) {
    next(err);
  }
};

exports.previousQuestion = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user || !user.history || user.history.length === 0) {
      return next(new AppError("No question history found", status_code.NOT_FOUND));
    }

    let lastAttempt = null;

    for (let i = user.history.length - 1; i >= 0; i -= 1) {
      const historyItem = user.history[i];

      if (!historyItem.questions || historyItem.questions.length === 0) {
        continue;
      }

      lastAttempt = historyItem.questions[historyItem.questions.length - 1];
      break;
    }

    if (!lastAttempt || !lastAttempt.questionId) {
      return next(new AppError("No previous question found", status_code.NOT_FOUND));
    }

    const question = await Question.findById(lastAttempt.questionId);

    if (!question) {
      return next(new AppError("Question not found", status_code.NOT_FOUND));
    }

    return res.status(status_code.SUCCESS).json({
      moduleId: user.activeState?.moduleId || null,
      previousQuestion: question,
      selectedOption: lastAttempt.selectedOption,
      answeredAt: lastAttempt.answeredAt || null,
    });
  } catch (err) {
    return next(err);
  }
};
