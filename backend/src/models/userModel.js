const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password_hash: { type: String, required: true },
    role: { type: String, enum: ["Admin", "Member"], default: "Member" },
    is_active: { type: Boolean, default: true }
  },
  { timestamps: { createdAt: "created_at", updatedAt: "updated_at" } }
);

const User = mongoose.models.User || mongoose.model("User", userSchema);

function escapeRegex(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function toUser(doc, { includePassword = false } = {}) {
  if (!doc) return null;
  const user = doc.toObject ? doc.toObject() : doc;
  const output = {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    role: user.role,
    is_active: user.is_active,
    created_at: user.created_at,
    updated_at: user.updated_at
  };
  if (includePassword) output.password_hash = user.password_hash;
  return output;
}

async function create({ name, email, passwordHash, role = "Member" }) {
  const user = await User.create({ name, email, password_hash: passwordHash, role });
  return toUser(user);
}

async function findByEmail(email) {
  const user = await User.findOne({ email });
  return toUser(user, { includePassword: true });
}

async function findById(id) {
  if (!mongoose.isValidObjectId(id)) return null;
  const user = await User.findById(id);
  return toUser(user);
}

async function list({ role, search } = {}) {
  const query = { is_active: true };
  if (role) query.role = role;
  if (search) {
    const pattern = new RegExp(escapeRegex(search), "i");
    query.$or = [{ name: pattern }, { email: pattern }];
  }

  const users = await User.find(query).sort({ name: 1 });
  return users.map((user) => toUser(user));
}

module.exports = { User, create, findByEmail, findById, list, toUser };
