const Dashboard = require("../models/dashboardModel");

async function getStats(req, res, next) {
  try {
    const stats = await Dashboard.stats(req.user);
    res.status(200).json(stats);
  } catch (error) {
    next(error);
  }
}

module.exports = { getStats };
