const router = require("express").Router();

const {
  registerUser,
  loginUser,
  allUsers,
} = require("../controllers/userControllers");
const { authMiddleware } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.get("/", authMiddleware, allUsers);

module.exports = router;
