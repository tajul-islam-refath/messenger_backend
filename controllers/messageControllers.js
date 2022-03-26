const Chat = require("../model/ChatModel");
const Message = require("../model/MessageModel");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");

exports.sendMessage = asyncHandler(async function (req, res) {
  const { text, receiverId, attachment, chatId } = req.body;
  if (!text || !chatId) {
    console.log("Text or chatId not provided");
    return res.status(400);
  }

  let newMessage = {
    text,
    sender: req.user._id,
    chatId,
  };

  try {
    let message = await Message.create(newMessage);
    message = await message.populate("sender", "name avatar");
    message = await message.populate("chatId");

    message = await User.populate(message, {
      path: "chatId.users",
      select: "name avatar email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message._id,
    });

    // console.log(message);
    res.status(201).json({
      message,
    });
  } catch (e) {
    console.log(e);
    res.status(400).json({ message: e.message });
  }
});

exports.getAllMessages = asyncHandler(async function (req, res) {
  const { chatId } = req.params;
  try {
    const messages = await Message.find({ chatId })
      .populate("sender", "name avatar")
      .populate("chatId");

    res.status(200).send({
      messages,
    });
  } catch (e) {
    console.log(e.message);
    res.status(404);
  }
});
