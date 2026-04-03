const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");
const {
  QuestionRepository,
  ModuleRepository,
  UserRepository,
} = require("../repository");

const questionRepository = new QuestionRepository();
const moduleRepository = new ModuleRepository();
const userRepository = new UserRepository();

function requireNonEmptyString(value, fieldLabel) {
  if (value === undefined || value === null) {
    return `${fieldLabel} is required`;
  }
  if (typeof value !== "string") {
    return `${fieldLabel} must be a non-empty string`;
  }
  if (value.trim() === "") {
    return `${fieldLabel} cannot be empty or whitespace only`;
  }
  return null;
}

exports.getQuestion = async (req, res, next) => {
  try {
    const { moduleId: rawModuleId } = req.params;
    const moduleId =
      typeof rawModuleId === "string" ? rawModuleId.trim() : rawModuleId;

    const moduleIdError = requireNonEmptyString(moduleId, "moduleId");
    if (moduleIdError) {
      return next(new AppError(moduleIdError, status_code.BAD_REQUEST));
    }

    if (!req.user || !req.user.id) {
      return next(
        new AppError(
          "Authenticated user id is missing; please log in again",
          status_code.UNAUTHORIZED,
        ),
      );
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const moduleData =
      await moduleRepository.findByModuleIdWithStartQuestion(moduleId);
    if (!moduleData) {
      return next(new AppError("Module not found", status_code.NOT_FOUND));
    }

    const startQuestion = moduleData.startQuestion;
    if (!startQuestion) {
      return next(
        new AppError("Start question not found", status_code.NOT_FOUND),
      );
    }

    return res.status(status_code.SUCCESS).json({
      module: {
        name: moduleData.name,
        moduleId: moduleData.module_id,
      },
      startQuestion,
    });
  } catch (err) {
    return next(err);
  }
};

exports.getQuestionByDeepLink = async (req, res, next) => {
  try {
    const { moduleId: rawModuleId, questionId: rawQuestionId } = req.params;
    const moduleId =
      typeof rawModuleId === "string" ? rawModuleId.trim() : rawModuleId;
    const questionId =
      typeof rawQuestionId === "string" ? rawQuestionId.trim() : rawQuestionId;

    const moduleIdError = requireNonEmptyString(moduleId, "moduleId");
    if (moduleIdError) {
      return next(new AppError(moduleIdError, status_code.BAD_REQUEST));
    }

    const questionIdError = requireNonEmptyString(questionId, "questionId");
    if (questionIdError) {
      return next(new AppError(questionIdError, status_code.BAD_REQUEST));
    }

    if (!req.user || !req.user.id) {
      return next(
        new AppError(
          "Authenticated user id is missing; please log in again",
          status_code.UNAUTHORIZED,
        ),
      );
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const moduleData = await moduleRepository.findByModuleId(moduleId);
    if (!moduleData) {
      return next(new AppError("Module not found", status_code.NOT_FOUND));
    }

    const normalizedQuestionId = questionId.toString();
    const isStartQuestionMatch =
      moduleData.startQuestion?.toString() === normalizedQuestionId;
    const isQuestionInModule = moduleData.questions.some(
      (id) => id.toString() === normalizedQuestionId,
    );

    if (!isStartQuestionMatch && !isQuestionInModule) {
      return next(
        new AppError(
          "Question does not belong to the requested module",
          status_code.BAD_REQUEST,
        ),
      );
    }

    const question = await questionRepository.findById(questionId);
    if (!question) {
      return next(new AppError("Question not found", status_code.NOT_FOUND));
    }

    return res.status(status_code.SUCCESS).json({
      module: {
        name: moduleData.name,
        moduleId: moduleData.module_id,
      },
      question,
    });
  } catch (err) {
    return next(err);
  }
};

exports.nextQuestion = async (req, res, next) => {
  try {
    const { currentQuestionId, answer, moduleId: rawModuleId } = req.body;
    const moduleId =
      typeof rawModuleId === "string" ? rawModuleId.trim() : rawModuleId;

    if (!currentQuestionId) {
      return next(
        new AppError(
          "currentQuestionId is required (the id of the question being answered)",
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (answer === undefined || answer === null || answer === "") {
      return next(
        new AppError(
          'answer is required (e.g. "yes" or "no", matching an option on the question)',
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (typeof answer !== "string") {
      return next(
        new AppError("answer must be a string", status_code.BAD_REQUEST),
      );
    }

    const moduleIdError = requireNonEmptyString(moduleId, "moduleId");
    if (moduleIdError) {
      return next(new AppError(moduleIdError, status_code.BAD_REQUEST));
    }

    if (!req.user || !req.user.id) {
      return next(
        new AppError(
          "Authenticated user id is missing; please log in again",
          status_code.UNAUTHORIZED,
        ),
      );
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    if (
      user.activeState?.moduleId &&
      user.activeState.moduleId.toString() !== moduleId
    ) {
      return next(
        new AppError(
          "Module mismatch with active session",
          status_code.BAD_REQUEST,
        ),
      );
    }

    const question = await questionRepository.findById(currentQuestionId);
    if (!question) {
      return next(new AppError("Question not found", status_code.NOT_FOUND));
    }

    if (!question.options[answer]) {
      const allowed = Object.keys(question.options || {}).join(", ") || "none";
      return next(
        new AppError(
          `Invalid option "${answer}". Allowed options for this question: ${allowed}`,
          status_code.BAD_REQUEST,
        ),
      );
    }

    const nextQId = question.options[answer].nextQuestion;

    // Save history first regardless of terminal state
    const existingEntry = user.history.find(
      (h) => h.moduleId?.toString() === moduleId,
    );

    if (existingEntry) {
      existingEntry.questions.push({
        questionId: question._id,
        question: question.question,
        selectedOption: answer,
        answeredAt: new Date(),
      });
    } else {
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
    }

    // Terminal question — no next question configured
    if (!nextQId) {
      user.activeState = { moduleId, currentQuestion: null };
      user.markModified("history");
      await user.save();

      return res.status(status_code.SUCCESS).json({
        isComplete: true,
        message: "You have completed this module",
      });
    }

    const nextQuestion = await questionRepository.findById(nextQId);
    if (!nextQuestion) {
      return next(
        new AppError("Next question not found", status_code.NOT_FOUND),
      );
    }

    user.activeState = { moduleId, currentQuestion: nextQId };
    user.markModified("history");
    await user.save();

    return res.status(status_code.SUCCESS).json({
      isComplete: false,
      nextQuestion: {
        _id: nextQuestion._id,
        question: nextQuestion.question,
        options: Object.keys(nextQuestion.options),
        isCheckPoint: nextQuestion.isCheckPoint,
      },
    });
  } catch (err) {
    return next(err);
  }
};

exports.previousQuestion = async (req, res, next) => {
  try {
    if (!req.user || !req.user.id) {
      return next(
        new AppError(
          "Authenticated user id is missing; please log in again",
          status_code.UNAUTHORIZED,
        ),
      );
    }

    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const activeModuleId = user.activeState?.moduleId;
    if (!activeModuleId) {
      return next(
        new AppError("No active module session found", status_code.NOT_FOUND),
      );
    }

    const moduleHistory = user.history.find(
      (h) => h.moduleId?.toString() === activeModuleId.toString(),
    );

    if (!moduleHistory || moduleHistory.questions.length === 0) {
      return next(
        new AppError(
          "No previous question found for this module",
          status_code.NOT_FOUND,
        ),
      );
    }

    const lastAttempt = moduleHistory.questions.at(-1);

    if (!lastAttempt || !lastAttempt.questionId) {
      return next(
        new AppError("No previous question found", status_code.NOT_FOUND),
      );
    }

    const question = await questionRepository.findById(lastAttempt.questionId);
    if (!question) {
      return next(new AppError("Question not found", status_code.NOT_FOUND));
    }

    return res.status(status_code.SUCCESS).json({
      moduleId: activeModuleId,
      previousQuestion: question,
      selectedOption: lastAttempt.selectedOption,
      answeredAt: lastAttempt.answeredAt || null,
    });
  } catch (err) {
    return next(err);
  }
};