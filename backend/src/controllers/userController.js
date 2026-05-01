const User = require("../models/userModel");

async function listUsers(req, res, next) {
  try {
    const users = await User.list(req.query);
    res.status(200).json({ users });
  } catch (error) {
    next(error);
  }
}

module.exports = { listUsers };
