const mongoose = require("mongoose");
const app = require("./index");
const dotenv = require("dotenv");

/// setting up confige file
if (process.env.NODE_ENV != "PRODUCTION") {
  dotenv.config({ path: "./.env" });
}

// database and server connect
const dbName = process.env.DB_NAME;
const dbPass = process.env.DB_PASS;
const url = `mongodb+srv://${dbName}:${dbPass}@cluster0.ltldm.mongodb.net/messenger?retryWrites=true&w=majority`;
let server;
mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("Database Connect Success");
  })
  .catch((e) => {
    return console.log(e);
  });

server = app.listen(process.env.PORT, () => {
  console.log(`Server Started on PORT ${process.env.PORT}`);
});

// socket.io setup
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

// connect socket io
io.on("connection", (socket) => {
  console.log("socket.io connection is done");

  // received user from client
  socket.on("setup", (userData) => {
    // console.log(userData);
    // create user room
    socket.join(userData._id);
    // send response back to client
    socket.emit("response");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joind room  " + room);
    // console.log(socket.rooms);
  });

  // new message chat
  socket.on("new message", (message) => {
    let chat = message.chatId;
    if (!chat.users) {
      return console.log("Chat.users not defined");
    }

    chat.users.forEach((user) => {
      if (user._id == message.sender._id) return;

      // join user in room with user_id
      socket.in(user._id).emit("message recieved", message);
      console.log(socket.rooms);
    });
  });

  // for typing effect
  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
});
