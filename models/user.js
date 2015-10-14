var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema ({
  email:  String,
  password:  String,
  avatar: String ,
  comment: []
},{collection: 'user', strict: false})

var User = mongoose.model("user", userSchema);

module.exports = User;


// NOTE: these should be set to reqired....eventually.
