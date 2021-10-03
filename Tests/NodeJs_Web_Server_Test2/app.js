/* #region  Modules Imports  */
const express = require("express");
const mongoose = require("mongoose");

const profileRouter = require("./router/profileRouter");
const postsRouter = require("./router/postsRouter");
const userRouter = require("./router/userRouter");
const mainRouter = require("./router/mainRouter");
const errorRouter = require("./router/errorRouter");
/* #endregion */

/* #region  Express package settings */
const myApp = express();
myApp.use(express.json());
myApp.use(express.urlencoded({ extended: true }));
myApp.use(express.static("public"));
/* #endregion */

/* #region  Db Connection Settings */
//Database config
const db = require("./config/keys").mongoURI;

//Connect to MongoDb
mongoose
  .connect(db)
  .then(() => console.log("we connected to our mongo db"))
  .catch((err) => console.log(err));
/* #endregion */

/* #region  App Router Settings */
myApp.use("/users", userRouter);
myApp.use("/posts", postsRouter);
myApp.use("/profiles", profileRouter);
myApp.use("/", mainRouter);
myApp.use(errorRouter);
/* #endregion */

/* #region  Port and Server settings */
var port = process.env.port || 3000;
myApp.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
/* #endregion */
