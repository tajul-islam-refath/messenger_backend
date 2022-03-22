const User = require("../model/UserModel");
const asyncHandler = require("express-async-handler");

exports.registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, image } = req.body;
  // console.log(req.body);

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Please enter all the feilds" });
  }

  const user = await new User({ name, email, password, avatar: image });
  await user.save();

  if (user) {
    res.status(201).json({
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
      },
      token: await user.getToken(),
    });
  } else {
    res.status(400).json({ message: "Faild to create a new user" });
  }
});

exports.loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({ message: "Email or password not correct" });
  }

  if (!user.matchPassword(password)) {
    return res.status(400).json({ message: "Email or password not correct" });
  }

  res.status(200).json({
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    },
    token: await user.getToken(),
  });
});

exports.allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};

  const users = await User.find(keyword);
  // .find({ _id: { $ne: req.user._id } })

  res.status(200).json({
    users,
  });
});
