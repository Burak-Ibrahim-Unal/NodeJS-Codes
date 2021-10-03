const express = require("express");
const router = express.Router();
const joi = require("@hapi/joi");

const profiles = [
  {
    id: 1,
    name: "Burak Profile",
    age: 34,
  },
  {
    id: 2,
    name: "İbrahim  Profile",
    age: 35,
  },
  {
    id: 3,
    name: "Ünal  Profile",
    age: 33,
  },
];

// @route http://localhost:3000/profiles
// @desc Tests Profiles route
// @access public
router.get("/", (req, res) => {
  console.log(req.query); // res.json({message:" Profile Works Great!"})
  if (req.query.inverse) {
    res.send(profiles.reverse());
  } else {
    res.send(profiles);
  }
});


// @route http://localhost:3000/profiles
// @desc Tests Profiles route with id
// @access public
router.get("/:id", (req, res) => {
  const selectedProfile = profiles.find((profile) => profile.id == parseInt(req.params.id));
  if (selectedProfile) {
    res.send(selectedProfile);
  } else {
    res.status(404).send("Invalid profile with id:" + req.params.id);
  }
});


// @route http://localhost:3000/profiles
// @desc Register Profiles route
// @access public
router.post("/", (req, res) => {
  const { error } = ValidateProfile(req.body);

  if (error) {
    res.status(400).send(error + "... Invalid inputs...");
  } else {
    const newProfile = {
      id: profiles.length + 1,
      name: req.body.name,
      age: req.body.age,
    };
    profiles.push(newProfile);
    res.send(newProfile);
  }
});

// @route http://localhost:3000/profiles
// @desc Update Profiles route
// @access public
router.put("/:id", (req, res) => {
  const selectedProfile = profiles.find(
    (profile) => profile.id === parseInt(req.params.id)
  );
  if (!selectedProfile) {
    return res.status(404).send(`Invalid id:${req.params.id}`);
  }

  //V1
  /* #region  This code works great. V2 is the same...Difference is string destruction... */
  // const result = ValidateProfile(req.body);
  //if (result.error) {
  //   res.status(400).send(result.error + "... Invalid inputs...");
  //   const result = ValidateProfile(req.body);
  // }
  /* #endregion */

  //V2
  const { error } = ValidateProfile(req.body);
  if (error) {
    res.status(400).send(error.details[0].message + "... Invalid inputs...");
  } else {
    (selectedProfile.name = req.body.name),
      (selectedProfile.age = req.body.age),
      res.send(selectedProfile);
  }
});


// @route http://localhost:3000/profiles/:id
// @desc Delete Profiles route
// @access public
router.delete("/:id", (req, res) => {
  const selectedProfile = profiles.find(
    (profile) => profile.id === parseInt(req.params.id)
  );
  if (selectedProfile) {
    const selectedProfileId = profiles.indexOf(selectedProfile);
    profiles.splice(selectedProfileId, 1);
    res.send(selectedProfile);
  } else {
    res.status(404).send(`Invalid profile with Id:${req.params.id}`);
  }
});

function ValidateProfile(profile) {
  const rules = joi.object({
    name: joi.string().min(3).max(50).required(),
    age: joi.number().integer().min(1).max(150).required(),
  });
  return rules.validate(profile);
}

module.exports = router;
