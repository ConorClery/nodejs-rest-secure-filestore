//This file sends/saves data to database
const mongoose = require('mongoose');

userSchema = mongoose.Schema({
   firstName: String,
   lastName: String,
   email: String,
   password: String,
   permissionLevel: Number,
   groups: [String],
   publicKey: String
});

const User = mongoose.model('User', userSchema);
module.exports.User = User;
module.exports.createUser = (userData) => {
    const user = new User(userData);
    return user.save();
};

module.exports.findById = (id) => {
    return User.findById(id).then((result) => {
        result = result.toJSON();
        console.log(result);
        delete result._id;
        delete result.__v;
        return result;
    });
}

exports.appendGroupsList = (id, group_id) => {
  return new Promise((resolve, reject) => {
    User.findById(id, function (err, user) {
        if (err) reject(err);
        var list = user.groups;
        list.push(group_id)
        user.save(function (err, updatedUser) {
            if (err) return reject(err);
            resolve(updatedUser);
        });
    });
  });
}

exports.patchUser = (id, userData) => {
    return new Promise((resolve, reject) => {
        User.findById(id, function (err, user) {
            if (err) reject(err);
            for (let i in userData) {
                user[i] = userData[i];
            }
            user.save(function (err, updatedUser) {
                if (err) return reject(err);
                resolve(updatedUser);
            });
        });
    })
};

module.exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
      User.find()
          .limit(perPage)
          .skip(perPage * page)
          .exec(function (err, users) {
              if (err) {
                  reject(err);
              } else {
                  resolve(users);
              }
          })
  });
};
