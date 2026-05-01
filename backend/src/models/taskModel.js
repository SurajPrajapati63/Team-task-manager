const mongoose = require("mongoose");

const allowedSort = new Set(["due_date", "priority", "status", "created_at", "title"]);

const taskSchema = new mongoose.Schema(
  {
    project_id: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    assigned_to: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["Pending", "In Progress", "Completed"], default: "Pending" },
    priority: { type: String, enum: ["Low", "Medium", "High", "Critical"], required: true },
    due_date: { type: Date, required: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Task = mongoose.models.Task || mongoose.model("Task", taskSchema);

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function idOf(value) {
  return value?._id ? value._id.toString() : value?.toString() || null;
}

function toTask(doc) {
  if (!doc) return null;
  const task = doc.toObject ? doc.toObject() : doc;
  return {
    id: idOf(task._id),
    project_id: idOf(task.project_id),
    project_name: task.project_id?.name,
    title: task.title,
    description: task.description,
    assigned_to: idOf(task.assigned_to),
    assignee_name: task.assigned_to?.name,
    created_by: idOf(task.created_by),
    creator_name: task.created_by?.name,
    status: task.status,
    priority: task.priority,
    due_date: task.due_date,
    created_at: task.created_at,
    updated_at: task.updated_at
  };
}

async function create(data) {
  const task = await Task.create({
    project_id: data.projectId,
    title: data.title,
    description: data.description,
    assigned_to: data.assignedTo || null,
    created_by: data.createdBy,
    status: data.status,
    priority: data.priority,
    due_date: data.dueDate
  });
  return findById(task._id);
}

async function findById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const task = await Task.findById(id)
    .populate("project_id", "name")
    .populate("assigned_to", "name")
    .populate("created_by", "name");
  return toTask(task);
}

async function list({ user, projectId, status, priority, search, sortBy = "due_date", order = "ASC" }) {
  const query = {};
  if (user.role !== "Admin") query.assigned_to = user.id;
  if (projectId && mongoose.isValidObjectId(projectId)) query.project_id = projectId;
  if (status) query.status = status;
  if (priority) query.priority = priority;

  const safeSort = allowedSort.has(sortBy) ? sortBy : "due_date";
  const safeOrder = String(order).toUpperCase() === "DESC" ? -1 : 1;
  const tasks = await Task.find(query)
    .populate("project_id", "name")
    .populate("assigned_to", "name")
    .sort({ [safeSort]: safeOrder });

  const mapped = tasks.map((task) => toTask(task));
  if (!search) return mapped;
  const pattern = new RegExp(escapeRegex(search), "i");
  return mapped.filter((task) => pattern.test(task.project_name || "") || pattern.test(task.title) || pattern.test(task.description || ""));
}

async function update(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;
  await Task.findByIdAndUpdate(id, {
    project_id: data.projectId,
    title: data.title,
    description: data.description,
    assigned_to: data.assignedTo || null,
    status: data.status,
    priority: data.priority,
    due_date: data.dueDate
  });
  return findById(id);
}

async function updateStatus(id, status) {
  if (!mongoose.isValidObjectId(id)) return null;
  await Task.findByIdAndUpdate(id, { status });
  return findById(id);
}

async function remove(id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Task.findByIdAndDelete(id);
  return Boolean(result);
}

module.exports = { Task, create, findById, list, update, updateStatus, remove, toTask };
