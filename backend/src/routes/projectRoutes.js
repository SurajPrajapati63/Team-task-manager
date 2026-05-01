const router = require("express").Router();
const {
  projectRules,
  memberRules,
  createProject,
  listProjects,
  updateProject,
  deleteProject,
  addMember,
  removeMember,
  members
} = require("../controllers/projectController");
const { protect, authorize } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.use(protect);
router.get("/", listProjects);
router.post("/", authorize("Admin"), projectRules, validate, createProject);
router.put("/:id", authorize("Admin"), projectRules, validate, updateProject);
router.delete("/:id", authorize("Admin"), deleteProject);
router.get("/:id/members", members);
router.post("/:id/members", authorize("Admin"), memberRules, validate, addMember);
router.delete("/:id/members/:userId", authorize("Admin"), removeMember);

module.exports = router;
