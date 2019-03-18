const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const db_options = require('../../config.json').DATABASE_OPTIONS;
const user_schema = require('./model.js')

mongoose.connect(db_options.URI, { useNewUrlParser: true }, function(err) {
  if (err) throw err;
  console.log("DB connected");
});


const registrationHandler = (req, res) => {
  registration_data = req.body;
  user_schema.insert(req, res);
}

const getByIDHandler = (req, res) => {
  user_schema.getById(req, res);
}

router.get("/user/:userId/", getByIDHandler);
router.post("/user/register/", registrationHandler);
// router.post("/user/login/", loginHandler);
// router.post("/user/logout/", registrationHandler);
// router.get("/user/details/" userDetailsHandler);


module.exports = router;
