const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/login/callback", (req, res) => {
  const authenticatedUser = req.userinfo;
  const lastName = authenticatedUser.family_name;
  const firstName = authenticatedUser.given_name;
  const email = authenticatedUser.preferred_username;
  // You may want to save the user's information to a secure database.
  res.json(authenticatedUser);
});

// Go to this route in your browser to test if the user authentication was a success.
router.get("/user", (req, res) => {
  res.json(req.userinfo);
});

module.exports = router;
