const express = require('express');
const router = express.Router();
const controller = require('./controller.js');

router.post('/group/create/', function (req, res) { controller.createGroup(req, res) });
router.get('/group/list/', function (req, res) { controller.list(req, res) });

module.exports = router;
