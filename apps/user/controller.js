//This file parses and validates request data before sending to database
const model = require('./model.js');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const config = require('../../config.json');

module.exports.insert = (req, res) => {
   let salt = crypto.randomBytes(16).toString('base64');
   let hash = crypto.createHmac('sha512',salt)
                                    .update(req.body.password)
                                    .digest("base64");
   req.body.password = salt + "$" + hash;
   req.body.permissionLevel = 1;
   model.createUser(req.body)
       .then((result) => {
           res.status(201).send({id: result._id});
       });
};

module.exports.getById = (req, res) => {
   model.findById(req.params.userId).then((result) => {
       res.status(200).send(result);
   });
};

module.exports.patchById = (req, res) => {
   if (req.body.password){
       let salt = crypto.randomBytes(16).toString('base64');
       let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
       req.body.password = salt + "$" + hash;
   }
   model.patchUser(req.params.userId, req.body).then((result) => {
           res.status(204).send({});
   });
};

module.exports.list = (req, res) => {
   var token = req.headers['x-access-token'];
   if (!token) return res.status(401).send({auth: false, message: 'No token included'});
   jwt.verify(token, config.JWT_SECRET, function (err, decoded) {
     if (err) return res.status(500).send({auth: false, message: "failed to authenticate token"});
     let limit = req.query.limit && req.query.limit <= 100 ? parseInt(req.query.limit) : 10;
     let page = 0;
     if (req.query) {
         if (req.query.page) {
             req.query.page = parseInt(req.query.page);
             page = Number.isInteger(req.query.page) ? req.query.page : 0;
         }
     }
     model.list(limit, page).then((result) => {
         res.status(200).send(result);
     });
   })
};

module.exports.login = (req, res) => {
    model.User.findOne({email:req.body.email}, function (err, user) {
      if (err) return res.status(500).send("Internal server error");
      if (!user) return res.status(404).send("Email not registered");
      console.log(user);
      let pass_on_record = user.password.split('$');
      let salt = pass_on_record[0];
      let hash = crypto.createHmac('sha512', salt).update(req.body.password).digest("base64");
      if (hash === pass_on_record[1]) {
        req.body = {
            userId: user._id,
            email: user.email,
            permissionLevel: user.permissionLevel,
            provider: 'email',
            name: user.firstName + ' ' + user.lastName,
        };
        try {
             let refreshId = req.body.userId + config.JWT_SECRET;
             let salt = crypto.randomBytes(16).toString('base64');
             let hash = crypto.createHmac('sha512', salt).update(refreshId).digest("base64");
             req.body.refreshKey = salt;
             let token = jwt.sign(req.body, config.JWT_SECRET);
             let b = new Buffer(hash);
             let refresh_token = b.toString('base64');
             res.status(201).send({accessToken: token, refreshToken: refresh_token});
         } catch (err) {
             console.error(err);
             res.status(500).send({errors: err});
         }
      }

    });
}
