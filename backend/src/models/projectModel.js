const mongoose = require("mongoose");
const { toUser } = require("./userModel");
const { Task } = require("./taskModel");

const projectSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    start_date: { type: Date, default: null },
    end_date: { type: Date, default: null },
    created_by: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const Project = mongoose.models.Project || mongoose.model("Project", projectSchema);

function idOf(value) {
  return value?._id ? value._id.toString() : value?.toString();
}

function toProject(doc, extras = {}) {
  if (!doc) return null;
  const project = doc.toObject ? doc.toObject() : doc;
  return {
    id: idOf(project._id),
    name: project.name,
    description: project.description,
    start_date: project.start_date,
    end_date: project.end_date,
    created_by: idOf(project.created_by),
    created_by_name: project.created_by?.name,
    created_at: project.created_at,
    updated_at: project.updated_at,
    total_tasks: extras.total_tasks ?? project.total_tasks ?? 0,
    completed_tasks: extras.completed_tasks ?? project.completed_tasks ?? 0
  };
}

async function create({ name, description, startDate, endDate, createdBy }) {
  const project = await Project.create({
    name,
    description,
    start_date: startDate || null,
    end_date: endDate || null,
    created_by: createdBy,
    members: [createdBy]
  });
  return findById(project._id);
}

async function findById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const project = await Project.findById(id).populate("created_by", "name");
  return toProject(project);
}

async function listForUser(user) {
  const query = user.role === "Admin" ? {} : { members: user.id };
  const projects = await Project.find(query).sort({ created_at: -1 });

  return Promise.all(
    projects.map(async (project) => {
      const taskQuery = { project_id: project._id };
      if (user.role !== "Admin") taskQuery.assigned_to = user.id;
      const tasks = await Task.find(taskQuery);
      return toProject(project, {
        total_tasks: tasks.length,
        completed_tasks: tasks.filter((task) => task.status === "Completed").length
      });
    })
  );
}

async function update(id, data) {
  if (!mongoose.isValidObjectId(id)) return null;
  await Project.findByIdAndUpdate(id, {
    name: data.name,
    description: data.description,
    start_date: data.startDate || null,
    end_date: data.endDate || null
  });
  return findById(id);
}

async function remove(id) {
  if (!mongoose.isValidObjectId(id)) return false;
  const result = await Project.findByIdAndDelete(id);
  if (result) await Task.deleteMany({ project_id: id });
  return Boolean(result);
}

async function addMember(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) return;
  await Project.findByIdAndUpdate(projectId, { $addToSet: { members: userId } });
}

async function removeMember(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) return false;
  const result = await Project.updateOne({ _id: projectId, members: userId }, { $pull: { members: userId } });
  return result.modifiedCount > 0;
}

async function members(projectId) {
  if (!mongoose.isValidObjectId(projectId)) return [];
  const project = await Project.findById(projectId).populate("members", "name email role is_active created_at updated_at");
  return project ? project.members.map((member) => toUser(member)) : [];
}

async function isMember(projectId, userId) {
  if (!mongoose.isValidObjectId(projectId) || !mongoose.isValidObjectId(userId)) return false;
  const project = await Project.findOne({ _id: projectId, members: userId });
  return Boolean(project);
}

module.exports = { Project, create, findById, listForUser, update, remove, addMember, removeMember, members, isMember, toProject };
