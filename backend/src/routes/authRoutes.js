const router = require("express").Router();
const { signupRules, loginRules, signup, login, logout, me } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");
const validate = require("../middleware/validate");

router.post("/signup", signupRules, validate, signup);
router.post("/login", loginRules, validate, login);
router.post("/logout", protect, logout);
router.get("/me", protect, me);

module.exports = router;
