const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const AppError = require("../utils/errors/error");
const { status_code } = require("../utils/statics/statics");




exports.signup = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return next(
        new AppError("Username and password are required", status_code.BAD_REQUEST),
      );
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashed });

    res.status(status_code.CREATED).json(user);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) {
      return next(new AppError("User not found", status_code.NOT_FOUND));
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return next(new AppError("Wrong password", status_code.BAD_REQUEST));
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.status(status_code.SUCCESS).json({ token });
  } catch (err) {
    next(err);
  }
};