const express = require("express");
const cors = require("cors");
require("dotenv").config();
const { connection } = require("../backend/");
const { userRoute } = require("./routes/userroute");
const { postRoute } = require("./routes/postroute");
const { auth } = require("./middleware/auth");
const app = express();
app.use(express.json());
app.use(cors());
app.use("/users", userRoute);
app.use(auth);
app.use("/post", postRoute);
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("connected to db");
  } catch (error) {
    console.log(error);
    console.log("NOt connected to db");
  }
  console.log("server running at port 8080");
});
module.exports = app;
