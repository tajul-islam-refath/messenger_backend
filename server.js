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
mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server Started on PORT ${process.env.PORT}`);
      console.log("Database Connect Success");
    });
  })
  .catch((e) => {
    return console.log(e);
  });
