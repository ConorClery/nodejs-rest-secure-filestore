const mongoose = require('mongoose');

groupSchema = mongoose.Schema({
   ownerId: String,
   members: [String],
   symmetricKey: String,
   mediaLinks: [String]
});

const Group = mongoose.model('Group', groupSchema);
module.exports.Group = Group;

module.exports.createGroup = (groupData) => {
    console.log("made it");
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
