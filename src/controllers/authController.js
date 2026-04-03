const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");
const { UserRepository } = require("../repository");

const userRepository = new UserRepository();



exports.signup = async (req, res, next) => {
  try {
    const { username: rawUsername, password: rawPassword } = req.body;
    const username =
      typeof rawUsername === "string" ? rawUsername.trim() : rawUsername;
    const password =
      typeof rawPassword === "string" ? rawPassword : rawPassword;

    if (username === undefined || username === null || username === "") {
      return next(
        new AppError(
          "Username is required and cannot be empty",
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (typeof username !== "string") {
      return next(
        new AppError("Username must be a string", status_code.BAD_REQUEST),
      );
    }

    if (password === undefined || password === null || password === "") {
      return next(
        new AppError(
          "Password is required and cannot be empty",
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (typeof password !== "string") {
      return next(
        new AppError("Password must be a string", status_code.BAD_REQUEST),
      );
    }

    if (password.length < 6) {
      return next(
        new AppError(
          "Password must be at least 6 characters long",
          status_code.BAD_REQUEST,
        ),
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await userRepository.create({ username, password: hashed });

    res.status(status_code.CREATED).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username: rawUsername, password: rawPassword } = req.body;
    const username =
      typeof rawUsername === "string" ? rawUsername.trim() : rawUsername;
    const password =
      typeof rawPassword === "string" ? rawPassword : rawPassword;

    if (username === undefined || username === null || username === "") {
      return next(
        new AppError(
          "Username is required and cannot be empty",
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (typeof username !== "string") {
      return next(
        new AppError("Username must be a string", status_code.BAD_REQUEST),
      );
    }

    if (password === undefined || password === null || password === "") {
      return next(
        new AppError(
          "Password is required and cannot be empty",
          status_code.BAD_REQUEST,
        ),
      );
    }

    if (typeof password !== "string") {
      return next(
        new AppError("Password must be a string", status_code.BAD_REQUEST),
      );
    }

    const user = await userRepository.findByUsername(username);
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Wrong password", status_code.BAD_REQUEST));
    }

    const jwtSecret = process.env.JWT_SECRET?.trim();
    const token = jwt.sign({ id: user._id }, jwtSecret);
    res.status(status_code.SUCCESS).json({ token });
  } catch (err) {
    next(err);
  }
};