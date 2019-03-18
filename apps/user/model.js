const mongoose = require('mongoose');
const crypto = require('crypto');

userSchema = mongoose.Schema({
   firstName: String,
   lastName: String,
   email: String,
   password: String,
   permissionLevel: Number
});

const User = mongoose.model('User', userSchema);

const createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

module.exports.insert = (req, res) => {
   let salt = crypto.randomBytes(16).toString('base64');
   let hash = crypto.createHmac('sha512',salt)
                                    .update(req.body.password)
                                    .digest("base64");
   req.body.password = salt + "$" + hash;
   req.body.permissionLevel = 1;
   createUser(req.body)
       .then((result) => {
           res.status(201).send({id: result._id});
       });
};

const findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        console.log(result);
        delete result._id;
        delete result.__v;
        return result;
    });
}

module.exports.getById = (req, res) => {
   findById(req.params.userId).then((result) => {
       res.status(200).send(result);
   });
};
