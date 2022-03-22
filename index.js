const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const app = express();

const userRoutes = require("./routes/userRoutes");
const chatRoutes = require("./routes/chatRoutes");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");

const middleware = [cors(), morgan("dev")];

app.use(middleware);
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);

// app.use(notFound);
// app.use(errorHandler);
module.exports = app;
