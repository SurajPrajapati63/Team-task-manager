const router = require("express").Router();
const {
  taskRules,
  statusRules,
  createTask,
  listTasks,
  updateTask,
  updateStatus,
  deleteTask
} = require("../controllers/taskController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);
router.get("/", listTasks);
router.post("/", authorize("Admin"), taskRules, validate, createTask);
router.put("/:id", authorize("Admin"), taskRules, validate, updateTask);
router.patch("/:id/status", statusRules, validate, updateStatus);
router.delete("/:id", authorize("Admin"), deleteTask);

module.exports = router;
