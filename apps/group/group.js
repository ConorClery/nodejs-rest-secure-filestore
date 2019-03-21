const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

router.get('/group/getUserGroups/', function (req, res) { controller.getUserGroups(req, res) });
router.post('/group/addUserToMastersGroup/', function (req, res) { controller.addUserToMastersGroup(req, res) });
router.post('/group/create/', function (req, res) { controller.createGroup(req, res) });
router.get('/group/list/', function (req, res) { controller.list(req, res) });
router.get('/group/findGroupById/', function (req, res) { controller.findUserOwnedGroups(req, res) })

module.exports = router;
