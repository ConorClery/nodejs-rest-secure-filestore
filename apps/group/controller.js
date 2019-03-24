const model = require('./model.js');
const userModel = require('../user/model.js')
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
        groupData.groupName = req.body.groupName;
        groupData.members = {user_id: user.userId, email:user.email, encrypted_symmetric: req.body.symmetricKey};
        model.createGroup(groupData).then((result) => {
                res.status(201).send(result);
        });
    }
};

module.exports.findUserOwnedGroups = (req, res) => {
    var user = authenticate(req, res);
    if (user) {
        console.log(user);
        console.log("authenticated");
        model.findUserOwnedGroups(user.userId).then((result) => {
            res.status(200).send(result);
        });
    }
}

module.exports.addUserToMastersGroup = (req, res) => {
    var user = authenticate(req, res);
    if (user) {
        console.log(user);
        console.log("authenticated");
        model.appendMembersList({email: req.body.email, user_id:user.userId, encrypted_symmetric: req.body.new_user_encrypted_symmetric}, req.body.group_id).then((result) => {
          res.status(200).send(result);
        });
    }
}

module.exports.getUserGroups = (req, res) => {
  var user = authenticate(req, res);
  if (user) {
      console.log("authenticated");
      model.findUserMemberGroups(user.email).then((result) => {
        res.status(200).send(result);
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

module.exports.updateGroupMedia = (req, res) => {
    var user = authenticate(req, res);
    if (user) {
      console.log("authenticated");
      model.patchGroupMedia(req.body.groupId, req.body.link).then((result) => {
        res.status(200).send(result);
      });
    }
};

const authenticate = (req, res) => {
  console.log(req.headers);
  var user;
  var token = req.headers['x-access-token'];
  if (!token) return res.status(401).send({auth: false, message: 'No token included'});
  return jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
    if (err) return res.status(500).send({auth: false, message: "Failed to authenticate token"});
    user = jwt.verify(token, config.JWT_SECRET);
    return user;
  });
};
