const { body, param } = require("express-validator");
const Project = require("../models/projectModel");
const ApiError = require("../utils/apiError");

const projectRules = [
  body("name").trim().isLength({ min: 2 }).withMessage("Project name is required"),
  body("description").optional({ nullable: true }).trim(),
  body("startDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("Start date must be valid"),
  body("endDate").optional({ nullable: true, checkFalsy: true }).isISO8601().withMessage("End date must be valid")
];

const memberRules = [
  param("id").isMongoId().withMessage("Project id must be valid"),
  body("userId").isMongoId().withMessage("User id must be valid")
];

async function createProject(req, res, next) {
  try {
    const project = await Project.create({
      ...req.body,
      description: req.body.description || null,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null,
      createdBy: req.user.id
    });
    res.status(201).json({ project });
  } catch (error) {
    next(error);
  }
}

async function listProjects(req, res, next) {
  try {
    const projects = await Project.listForUser(req.user);
    res.status(200).json({ projects });
  } catch (error) {
    next(error);
  }
}

async function updateProject(req, res, next) {
  try {
    const project = await Project.update(req.params.id, {
      ...req.body,
      description: req.body.description || null,
      startDate: req.body.startDate || null,
      endDate: req.body.endDate || null
    });
    if (!project) throw new ApiError(404, "Project not found");
    res.status(200).json({ project });
  } catch (error) {
    next(error);
  }
}

async function deleteProject(req, res, next) {
  try {
    const removed = await Project.remove(req.params.id);
    if (!removed) throw new ApiError(404, "Project not found");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function addMember(req, res, next) {
  try {
    await Project.addMember(req.params.id, req.body.userId);
    res.status(200).json({ message: "Member added to project" });
  } catch (error) {
    next(error);
  }
}

async function removeMember(req, res, next) {
  try {
    const removed = await Project.removeMember(req.params.id, req.params.userId);
    if (!removed) throw new ApiError(404, "Project member not found");
    res.status(204).send();
  } catch (error) {
    next(error);
  }
}

async function members(req, res, next) {
  try {
    const users = await Project.members(req.params.id);
    res.status(200).json({ members: users });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  projectRules,
  memberRules,
  createProject,
  listProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  members
};
