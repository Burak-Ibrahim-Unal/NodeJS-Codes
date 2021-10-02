const express = require("express");
const mainRouter = require("./router/mainRouter");
const userRouter = require("./router/userRouter");
const errorRouter = require("./router/errorRouter");
const myApp = express();

myApp.use(express.json());
myApp.use(express.urlencoded({ extended: true }));
myApp.use(express.static("public"));

myApp.use("/users", userRouter);
myApp.use("/", mainRouter);
myApp.use(errorRouter);

var port = 3000;
myApp.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
