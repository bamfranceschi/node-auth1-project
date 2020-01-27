const router = require("express").Router();
const bcrypt = require("bcryptjs");

const Users = require("../users/users-model.js");

//POST for creating a new user
router.post("/register", (req, res) => {
  let user = req.body;

  const hash = bcrypt.hashSync(req.body.password, 10);

  user.password = hash;

  Users.add(user)
    .then(saved => {
      res.status(201).json(saved);
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//POST for logging in
router.post("/login", (req, res) => {
  let { username, password } = req.body;

  Users.findBy({ username })
    .first()
    .then(user => {
      if (user && bcrypt.compareSync(password, user.password)) {
        res.status(200).json({ message: `Welcome ${user.username}!` });
      } else {
        res.status(401).json({ message: "Invalid Credentials" });
      }
    })
    .catch(error => {
      res.status(500).json(error);
    });
});

//GET for a full list of users
router.get("/users", (req, res) => {
  Users.find()
    .then(userList => {
      res.status(200).json({ userList });
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ message: "it broke" });
    });
});

module.exports = router;
