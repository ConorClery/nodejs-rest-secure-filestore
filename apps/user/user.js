const express = require('express');
const router = express.Router();
const controller = require('./controller.js')


const registrationHandler = (req, res) => {
  registration_data = req.body;
  controller.insert(req, res);
}

// const getByIDHandler = (req, res) => {
//   controller.getById(req, res);
// }

const userListHandler = (req, res) => {
  console.log("HERE");
  res.send(req);
}

// const userPatchHandler = (req, res) => {
//   controller.patchById(req, res);
// }


router.get("/user/get/:userId/", function (req, res) { controller.getById(req, res)});
router.post("/user/register/", registrationHandler);
// router.post("/user/login/", loginHandler);
// router.post("/user/logout/", registrationHandler);
router.get("/user/listem/", function (req, res) { controller.list(req, res)});
router.patch("/user/patch/:userId", function (req, res) { controller.patchById(req, res)});


module.exports = router;
