const bcrypt = require("bcryptjs");
const { body } = require("express-validator");
const User = require("../models/userModel");
const ApiError = require("../utils/apiError");
const { signToken } = require("../utils/token");

const signupRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Name must be at least 2 characters"),
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").isLength({ min: 8 }).withMessage("Password must be at least 8 characters"),
  body("role").optional().isIn(["Admin", "Member"])
];

const loginRules = [
  body("email").isEmail().normalizeEmail().withMessage("Valid email is required"),
  body("password").notEmpty().withMessage("Password is required")
];

async function signup(req, res, next) {
  try {
    const { name, email, password, role = "Member" } = req.body;
    const existing = await User.findByEmail(email);
    if (existing) throw new ApiError(409, "Email is already registered");

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await User.create({ name, email, passwordHash, role });
    const token = signToken(user);

    res.status(201).json({ user, token });
  } catch (error) {
    if (error.code === 11000) {
      return next(new ApiError(409, "Email is already registered"));
    }
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const userWithPassword = await User.findByEmail(email);
    if (!userWithPassword) throw new ApiError(401, "Invalid email or password");

    const ok = await bcrypt.compare(password, userWithPassword.password_hash);
    if (!ok) throw new ApiError(401, "Invalid email or password");

    const user = await User.findById(userWithPassword.id);
    const token = signToken(user);
    res.status(200).json({ user, token });
  } catch (error) {
    next(error);
  }
}

function logout(_req, res) {
  res.status(200).json({ message: "Logged out successfully. Remove the token on the client." });
}

async function me(req, res) {
  res.status(200).json({ user: req.user });
}

module.exports = { signupRules, loginRules, signup, login, logout, me };
