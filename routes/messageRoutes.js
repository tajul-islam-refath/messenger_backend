const route = require("express").Router();

const { authMiddleware } = require("../middleware/authMiddleware");
const {
  sendMessage,
  getAllMessages,
} = require("../controllers/messageControllers");

route.get("/allMessages/:chatId", authMiddleware, getAllMessages);
route.post("/sendMessage", authMiddleware, sendMessage);

module.exports = route;
