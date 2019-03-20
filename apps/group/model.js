const mongoose = require('mongoose');

groupSchema = mongoose.Schema({
   ownerId: String,
   members: [],
   mediaLinks: [String]
});



const Group = mongoose.model('Group', groupSchema);
module.exports.Group = Group;

module.exports.createGroup = (groupData) => {
    console.log(groupData);
    const group = new Group(groupData);
    return group.save();
};

module.exports.list = (perPage, page) => {
  return new Promise((resolve, reject) => {
      Group.find()
          .limit(perPage)
          .skip(perPage * page)
          .exec(function (err, groups) {
              if (err) {
                  reject(err);
              } else {
                  resolve(groups);
              }
          })
  });
};

module.exports.appendMembersList = (obj, id) => {
  return new Promise((resolve, reject) => {
    Group.findById(id, function (err, group) {
        if (err) reject(err);
        var list = group.members;
        list.push(obj);
        group.save(function (err, updatedGroup) {
            if (err) return reject(err);
            resolve(updatedGroup.members);
        });
    });
  });
};

module.exports.findUserOwnedGroups = (user_id) => {
  return new Promise((resolve, reject) => {
    Group.find({ownerId: user_id})
        .exec(function (err, groups) {
            if (err) {
                reject(err);
            } else {
                resolve(groups);
            }
        })
  });
};
