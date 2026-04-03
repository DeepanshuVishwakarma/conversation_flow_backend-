const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");
const { ModuleRepository, UserRepository } = require("../repository");

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

exports.switchModule = async (req, res, next) => {
  try {
    const { moduleId: rawModuleId } = req.body;
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

    const module = await moduleRepository.findByModuleId(moduleId);
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
    if (!req.user || !req.user.id) {
      return next(
        new AppError(
          "Authenticated user id is missing; please log in again",
          status_code.UNAUTHORIZED,
        ),
      );
    }

    const modules = await moduleRepository.getAllWithQuestions();

    res.status(status_code.SUCCESS).json({ modules });
  } catch (err) {
    next(err);
  }
};

exports.getModuleHistory = async (req, res, next) => {
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

    const user = await userRepository.findByIdWithSelect(req.user.id, "history");
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