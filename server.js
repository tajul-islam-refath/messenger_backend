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
    // join user in room
    socket.join(userData._id);
    // send response back to client
    socket.emit("response");
  });
});
