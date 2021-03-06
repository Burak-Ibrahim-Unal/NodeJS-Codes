const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");
const gravatar = require("gravatar");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const keys = require("../config/keys");
const passport = require("passport");

const User = require("../modules/User");
const validateRegisterInput = require("../validation/registration");
const validateLoginInput = require("../validation/login");
/* #region  Test User Array */
const users = [
  {
    name: "burak",
    age: 34,
    email: "burak@burak.com",
    country: "Turkey",
    avatar: null,
    password: "123456",
  },
  //   country: Turkey,
  // },
  // {
  //   id: 2,
  //   name: "İbrahim",
  //   age: 35,
  //   email: bbbb@gmail.com,
  //   country: England,

  // },
  // {
  //   id: 3,
  //   name: "Ünal",
  //   age: 33,
  //   email: cccc@gmail.com,
  //   country: Germany,

  // },
];
/* #endregion */

// @route http://localhost:3000/users
// @desc Tests Users route
// @access public

router.get("/", (req, res) => {
  console.log(req.query); // res.json({message:" User Works Great!"})
  if (req.query.inverse) {
    res.send(users.reverse());
  } else {
    res.send(users);
  }
});

// @route http://localhost:3000/users/register
// @desc Register Users route
// @access public

router.post("/register", (req, res) => {
  const { errors, isValid } = validateRegisterInput(req.body);
  if (!isValid) {
    return res.status(400).json(errors);
  }
  User.findOne({ email: req.body.email }).then((user) => {
    if (user) {
      errors.email = "Email already exists!";
      return res.status(400).json(errors);
      //  return res.status(400) send(`${email} already exists!`)
    } else {
      const avatar = gravatar.url(req.body.email, {
        s: "200", // size
        r: "pg", // rating
        d: "mm", // default
      });

      const newUser = new User({
        name: req.body.name,
        age: req.body.age,
        email: req.body.email,
        country: req.body.country,
        avatar,
        password: req.body.password,
      });

      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          newUser.password = hash;
          newUser
            .save()
            .then((user) => res.json(user))
            .catch((err) => console.log(err));
        });
      });
      users.push(newUser);
      res.send(newUser);
    }
  });
});

// @route http://localhost:3000/users/current
// @desc Return current user
// @access private
router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      country: req.user.country,
    });
  }
);

router.post("/login", (req, res) => {
  const { errors, isValid } = validateLoginInput(req.body);

  if (!isValid) {
    return res.status(400).json(errors);
  }
  const email = req.body.email;
  const password = req.body.password;

  User.findOne({ email }).then((user) => {
    if (!user) {
      errors.email = "User not found";
      return res.status(404).json(errors);
    }

    bcrypt.compare(password, user.password).then((isMatch) => {
      if (isMatch) {
        const payload = { id: user.id, name: user.name, avatar: user.avatar }; //Jwt payload

        jwt.sign(
          payload,
          keys.secretOrKey,
          { expiresIn: 3600 },
          (err, token) => {
            res.json({
              success: true,
              token: "Bearer " + token,
            });
          }
        );
        // res.json({ message: "Login  is successfull" });
      } else {
        errors.password = "Wrong password!!!";
        return res.status(400).json(errors);
      }
    });
  });
});

// @route http://localhost:3000/users
// @desc Tests Users route with id
// @access public
router.get("/:id", (req, res) => {
  const selectedUser = users.find((user) => user.id == parseInt(req.params.id));
  if (selectedUser) {
    res.send(selectedUser);
  } else {
    res
      .status(404)
      .send("Getting user is failed.Invalid user id:" + req.params.id);
  }
});

// @route http://localhost:3000/users
// @desc Update Users route
// @access public

router.put("/update/:id", (req, res) => {
  const selectedUser = users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (!selectedUser) {
    return res.status(404).send(`Update failed.Invalid id :${req.params.id}`);
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

// @route http://localhost:3000/users/:id
// @desc Delete Users route
// @access public
router.delete("/delete/:id", (req, res) => {
  const selectedUser = users.find(
    (user) => user.id === parseInt(req.params.id)
  );
  if (selectedUser) {
    const selectedUserId = users.indexOf(selectedUser);
    users.splice(selectedUserId, 1);
    res.send(selectedUser);
  } else {
    res.status(404).send(`Delete failed.Invalid user with Id:${req.params.id}`);
  }
});

// @route http://localhost:3000/users/login
// @desc Login Users route / Return json web token
// @access public

function ValidateUser(user) {
  const rules = joi.object({
    name: joi.string().min(3).max(50).required(),
    age: joi.number().integer().min(1).max(150).required(),
  });
  return rules.validate(user);
}

module.exports = router;
