const router = require('express').Router();

let User = require('../models/user.model');

router.route('/').get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/add').post((req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const usertype = req.body.usertype;
  let newUser = new User({ username, password, usertype });
  if (usertype == 'dealer') {
    newUser.balance = 1000;
  }

  newUser
    .save()
    .then(() => {
      console.log('USER POST REQUEST: ', req.body);
      res.status(200).json('User added!');
    })
    .catch((err) => res.status(400).json('Error: ' + err));
});

router.route('/login').post((req, res) => {
  const username = req.body.username.toLowerCase();
  const password = req.body.password;
  const usertype = req.body.usertype;

  User.findOne({ username: username, usertype: usertype })
    .then((foundUser) => {
      foundUser.comparePassword(password, function (err, isMatch) {
        if (err) throw err;
        if (isMatch) {
          res.status(200).json('Login success');
        } else {
          res.status(403).json('Incorrect password');
        }
      });
    })
    .catch(() => res.status(404).json('User not found'));
});

module.exports = router;
