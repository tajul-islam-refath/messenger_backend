const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");
const messageRoutes = require("./routes/messageRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const middleware = [cors(), morgan("dev")];

app.use(middleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.get("/", function (req, res) {
  res.status(301).redirect("https://dashing-donut-295ac1.netlify.app");
  // res.send({ name: "Refath", age: 14, status: "single" });
});

app.use("*", function (req, res) {
  res.status(404).send("Not Found");
});

app.use(notFound);
app.use(errorHandler);
module.exports = app;
