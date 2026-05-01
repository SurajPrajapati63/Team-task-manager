require("dotenv").config();

const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { testConnection } = require("../config/db");
const { User } = require("../models/userModel");
const { Project } = require("../models/projectModel");
const { Task } = require("../models/taskModel");

async function seed() {
  await testConnection();

  const password_hash = await bcrypt.hash("Password123!", 12);

  const admin = await User.findOneAndUpdate(
    { email: "admin@example.com" },
    { name: "Admin User", email: "admin@example.com", password_hash, role: "Admin", is_active: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const member = await User.findOneAndUpdate(
    { email: "member@example.com" },
    { name: "Member User", email: "member@example.com", password_hash, role: "Member", is_active: true },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const today = new Date();
  const projectEnd = new Date(today);
  projectEnd.setDate(projectEnd.getDate() + 30);

  const project = await Project.findOneAndUpdate(
    { name: "Website Redesign" },
    {
      $set: {
        name: "Website Redesign",
        description: "Refresh the customer-facing website.",
        start_date: today,
        end_date: projectEnd,
        created_by: admin._id
      },
      $addToSet: { members: { $each: [admin._id, member._id] } }
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const dueDate = new Date(today);
  dueDate.setDate(dueDate.getDate() + 7);

  await Task.findOneAndUpdate(
    { project_id: project._id, title: "Build dashboard UI" },
    {
      project_id: project._id,
      title: "Build dashboard UI",
      description: "Create responsive dashboard cards and task table.",
      assigned_to: member._id,
      created_by: admin._id,
      status: "In Progress",
      priority: "High",
      due_date: dueDate
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  await mongoose.disconnect();
  console.log("MongoDB seed complete");
}

seed().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
