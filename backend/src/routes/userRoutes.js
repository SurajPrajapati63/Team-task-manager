const router = require("express").Router();
const { listUsers } = require("../controllers/userController");
const { protect, authorize } = require("../middleware/authMiddleware");

router.get("/", protect, authorize("Admin"), listUsers);

module.exports = router;
