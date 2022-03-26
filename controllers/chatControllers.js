const Chat = require("../model/ChatModel");
const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");

exports.accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  // console.log(userId);

  if (!userId) {
    console.log("User not found");
    return res.status(401).json({ message: "User not found" });
  }

  var isChat = await Chat.find({
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
      const newChat = await new Chat({
        chatName: "sender",
        isGroupChat: false,
        users: [req.user._id, userId],
      });

      await newChat.save();

      const fullChat = await Chat.find({ _id: newChat._id }).populate(
        "users",
        "-password"
      );

      // console.log(fullChat);

      res.status(200).send(fullChat);
    } catch (e) {
      res.status(400);
      throw new Error(e.message);
    }
  }
});

exports.getAllChats = asyncHandler(async function (req, res) {
  // console.log(req.user);
  try {
    let chats = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
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
  if (users.length <= 1) {
    return res.status(400).json({
      message: "More than 1 users required for group chat",
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

    await newGroupChat.save();

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

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    { chatName },
    {
      new: true,
    }
  )
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

exports.addInGroup = asyncHandler(async function (req, res) {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({
      message: "Error happened while adding user into group",
    });
  }

  const groupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (groupChat) {
    res.status(200).json({
      chat: groupChat,
    });
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});

exports.removeFromGroupChat = asyncHandler(async function (req, res) {
  const { chatId, userId } = req.body;

  if (!chatId || !userId) {
    return res.status(400).json({
      message: "Error happened while adding user into group",
    });
  }

  const groupChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (groupChat) {
    res.status(200).json({
      chat: groupChat,
    });
  } else {
    res.status(404).json({ message: "Chat not found" });
  }
});
