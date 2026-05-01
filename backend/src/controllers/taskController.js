const { body } = require("express-validator");
const Task = require("../models/taskModel");
const ApiError = require("../utils/apiError");

const taskRules = [
  body("projectId").isMongoId().withMessage("Project is required"),
  body("title").trim().isLength({ min: 2 }).withMessage("Task title is required"),
  body("description").optional({ nullable: true }).trim(),
  body("assignedTo").optional({ nullable: true, checkFalsy: true }).isMongoId().withMessage("Assignee must be valid"),
  body("status").optional().isIn(["Pending", "In Progress", "Completed"]),
  body("priority").isIn(["Low", "Medium", "High", "Critical"]).withMessage("Priority is invalid"),
  body("dueDate").isISO8601().withMessage("Due date is required")
];

const statusRules = [body("status").isIn(["Pending", "In Progress", "Completed"])];

async function createTask(req, res, next) {
  try {
    const task = await Task.create({
      ...req.body,
      description: req.body.description || null,
      assignedTo: req.body.assignedTo || null,
      createdBy: req.user.id,
      status: req.body.status || "Pending"
    });
    res.status(201).json({ task });
  } catch (error) {
    next(error);
  }
}

async function listTasks(req, res, next) {
  try {
    const tasks = await Task.list({ user: req.user, ...req.query });
    res.status(200).json({ tasks });
  } catch (error) {
    next(error);
  }
}

async function updateTask(req, res, next) {
  try {
    const task = await Task.update(req.params.id, {
      ...req.body,
      description: req.body.description || null,
      assignedTo: req.body.assignedTo || null
    });
    if (!task) throw new ApiError(404, "Task not found");
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

async function updateStatus(req, res, next) {
  try {
    const existing = await Task.findById(req.params.id);
    if (!existing) throw new ApiError(404, "Task not found");
    if (req.user.role !== "Admin" && existing.assigned_to !== req.user.id) {
      throw new ApiError(403, "You can update only your assigned tasks");
    }
    const task = await Task.updateStatus(req.params.id, req.body.status);
    res.status(200).json({ task });
  } catch (error) {
    next(error);
  }
}

async function deleteTask(req, res, next) {
  try {
    const removed = await Task.remove(req.params.id);
    if (!removed) throw new ApiError(404, "Task not found");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

module.exports = {
  taskRules,
  statusRules,
  createTask,
  listTasks,
  updateTask,
  updateStatus,
  deleteTask
};
