const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");

const users = [
  {
    id: 1,
    name: "Burak",
    age: 34,
  },
  {
    id: 2,
    name: "İbrahim",
    age: 35,
  },
  {
    id: 3,
    name: "Ünal",
    age: 33,
  },
];

router.get("/", (req, res) => {
  console.log(req.query);
  if (req.query.inverse) {
    res.send(users.reverse());
  } else {
    res.send(users);
  }
});

router.get("/:id", (req, res) => {
  const selectedUser = users.find((user) => user.id == parseInt(req.params.id));
  if (selectedUser) {
    res.send(selectedUser);
  } else {
    res.status(404).send("Invalid user with id:" + req.params.id);
  }
});

router.post("/", (req, res) => {
  const { error } = ValidateUser(req.body);

  if (error) {
    res.status(400).send(error + "... Invalid inputs...");
  } else {
    const newUser = {
      id: users.length + 1,
      name: req.body.name,
      age: req.body.age,
    };
    users.push(newUser);
    res.send(newUser);
  }
});

router.put("/:id", (req, res) => {
  const selectedUser = users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (!selectedUser) {
    return res.status(404).send(`Invalid id:${req.params.id}`);
  }

  //V1
  /* #region  This code works great. V2 is the same...Difference is string destruction... */
  // const result = ValidateUser(req.body);
  //if (result.error) {
  //   res.status(400).send(result.error + "... Invalid inputs...");
  //   const result = ValidateUser(req.body);
  // }
  /* #endregion */

  //V2
  const { error } = ValidateUser(req.body);
  if (error) {
    res.status(400).send(error.details[0].message + "... Invalid inputs...");
  } else {
    (selectedUser.name = req.body.name),
      (selectedUser.age = req.body.age),
      res.send(selectedUser);
  }
});

router.delete("/:id", (req, res) => {
  const selectedUser = users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (selectedUser) {
    const selectedUserId = users.indexOf(selectedUser);
    users.splice(selectedUserId, 1);
    res.send(selectedUser);
  } else {
    res.status(404).send(`Invalid user with Id:${req.params.id}`);
  }
});

function ValidateUser(user) {
  const rules = joi.object({
    name: joi.string().min(3).max(50).required(),
    age: joi.number().integer().min(1).max(150).required(),
  });
  return rules.validate(user);
}

module.exports = router;
