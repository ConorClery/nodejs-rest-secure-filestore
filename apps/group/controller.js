const model = require('./model.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

module.exports.createGroup = (req, res) => {
    var user = authenticate(req, res);
    console.log(user);
    if (user) {
        console.log("authenticated");
        var groupData = {};
        groupData.ownerId = user.userId;
        groupData.members = user.userId;
        groupData.symmetricKey = crypto.randomBytes(16).toString('base64');
        model.createGroup(groupData).then((result) => {
            res.status(201).send(result);
        });
    }
};

module.exports.list = (req, res) => {
    var user = authenticate(req, res);
    if (user) {
        console.log("authenticated");
        model.list().then((result) => {
          res.status(200).send(result);
        });
    }
};

const authenticate = (req, res) => {
  var user;
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({auth: false, message: 'No token included'});
  return jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(500).send({auth: false, message: "Failed to authenticate token"});
    user = jwt.verify(token, config.JWT_SECRET);
    return user;
  });
};
