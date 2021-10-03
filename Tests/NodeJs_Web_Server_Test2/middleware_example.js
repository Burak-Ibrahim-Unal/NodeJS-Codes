const express = require("express");
const myApp = express();

function myMiddleware1(req, res, next) {
  console.log("m1 middleware invoked");
  next();
}
// function myMiddleware2(req, res, nett) {
//   console.log("m2 invoked");
// }

myApp.use(myMiddleware1);
myApp.use((req, res, next) => {
  console.log("m2 middleware invoked");
  req.time = Date.now();
  next();
});

console.log("--------");
/* #region  middleware sample usage */
// myApp.use((req,res,next) => {
//   //...
// });
/* #endregion */

myApp.get("/user", (req, res) => {
  console.log("m3 get middleware invoked at " + req.time);
});

myApp.post("/user", (req, res) => {
  console.log("m4 post middleware invoked");
});

var port = 3000;
myApp.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
