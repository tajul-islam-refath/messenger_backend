const Chat = require("../model/ChatModel");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("User not found");
    return res.status(401).json({ message: "User not found" });
  }

  var isChat = await new Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name avatar email",
  });

  if (isChat.length > 0) {
    res.status(200).json({
      chat: isChat[0],
    });
  } else {
    try {
      const newChat = await Chat({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      await newChat.save();

      const fullChat = await Chat.find({ _is: newChat._id }).populate(
        "users",
        "-password"
      );

      res.status(200).send(fullChat);
    } catch (e) {
      res.status(400);
      throw new Error(e.message);
    }
  }
});

exports.getAllChats = asyncHandler(async function (req, res) {
  try {
    const chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("user", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 });

    chats = await User.populate(chats, {
      path: "latestMessage.sender",
      select: "name avatar email",
    });

    res.status(200).json({
      chats,
    });
  } catch (e) {
    res.status(400).json({
      message: e.message,
    });
  }
});

exports.createGroupChat = asyncHandler(async function (req, res) {
  if (!req.body.users || !req.body.name) {
    return res.status(400).json({
      message: "Please fill all the required fields",
    });
  }

  var users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res.status(400).json({
      message: "More than 2 users required for group chat",
    });
  }

  users.push(req.user);

  try {
    const newGroupChat = await new Chat({
      chatName: req.body.name,
      isGroupChat: true,
      users,
      groupAdmin: req.user._id,
    });

    const findChat = await Chat.findOne({ _id: newGroupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(201).json({
      chat: findChat,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

exports.renameChat = asyncHandler(async function (req, res) {
  const { chatId, chatName } = req.body;

  if (!chatId || !chatName) {
    return res.status(400).json({
      message: "Error for renaming group chat",
    });
  }

  const updatedChat = await Chat.findByIdAndUpdate(chatId, chatName, {
    new: true,
  })
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (updatedChat) {
    res.status(200).json({
      chat: updatedChat,
    });
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});
