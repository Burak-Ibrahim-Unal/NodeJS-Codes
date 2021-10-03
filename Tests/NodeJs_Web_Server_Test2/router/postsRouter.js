const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");

const posts = [
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

// @route http://localhost:3000/profiles
// @desc Tests Profiles route
// @access public
router.get("/", (req, res) => {
  console.log(req.query); // res.json({message:" Post Works Great!"})
  if (req.query.inverse) {
    res.send(posts.reverse());
  } else {
    res.send(posts);
  }
});


// @route http://localhost:3000/profiles
// @desc Tests Profiles route with id
// @access public
router.get("/:id", (req, res) => {
  const selectedPost = posts.find((post) => post.id == parseInt(req.params.id));
  if (selectedPost) {
    res.send(selectedPost);
  } else {
    res.status(404).send("Invalid post with id:" + req.params.id);
  }
});


// @route http://localhost:3000/profiles
// @desc Register Profiles route
// @access public
router.post("/", (req, res) => {
  const { error } = ValidatePost(req.body);

  if (error) {
    res.status(400).send(error + "... Invalid inputs...");
  } else {
    const newPost = {
      id: posts.length + 1,
      name: req.body.name,
      age: req.body.age,
    };
    posts.push(newPost);
    res.send(newPost);
  }
});


// @route http://localhost:3000/profiles
// @desc Update Profiles route
// @access public
router.put("/:id", (req, res) => {
  const selectedPost = posts.find(
    (post) => post.id === parseInt(req.params.id)
  );
  if (!selectedPost) {
    return res.status(404).send(`Invalid id:${req.params.id}`);
  }

  //V1
  /* #region  This code works great. V2 is the same...Difference is string destruction... */
  // const result = ValidatePost(req.body);
  //if (result.error) {
  //   res.status(400).send(result.error + "... Invalid inputs...");
  //   const result = ValidatePost(req.body);
  // }
  /* #endregion */

  //V2
  const { error } = ValidatePost(req.body);
  if (error) {
    res.status(400).send(error.details[0].message + "... Invalid inputs...");
  } else {
    (selectedPost.name = req.body.name),
      (selectedPost.age = req.body.age),
      res.send(selectedPost);
  }
});


// @route http://localhost:3000/profiles/:id
// @desc Delete Profiles route
// @access public
router.delete("/:id", (req, res) => {
  const selectedPost = posts.find(
    (post) => post.id === parseInt(req.params.id)
  );
  if (selectedPost) {
    const selectedPostId = posts.indexOf(selectedPost);
    posts.splice(selectedPostId, 1);
    res.send(selectedPost);
  } else {
    res.status(404).send(`Invalid post with Id:${req.params.id}`);
  }
});

function ValidatePost(post) {
  const rules = joi.object({
    name: joi.string().min(3).max(50).required(),
    age: joi.number().integer().min(1).max(150).required(),
  });
  return rules.validate(post);
}

module.exports = router;
