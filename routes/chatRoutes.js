const router = require("express").Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  accessChat,
  getAllChats,
  createGroupChat,
  renameChat,
} = require("../controllers/chatControllers");

router.post("/accessChat", authMiddleware, accessChat);
router.get("/allChats", authMiddleware, getAllChats);

router.post("/createGroup", authMiddleware, createGroupChat);
router.put("renameGroup", authMiddleware, renameChat);
router.put("/addInGroup", authMiddleware);
router.delete("/removeGroup", authMiddleware);

module.exports = router;
