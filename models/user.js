var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var userSchema = new Schema ({
  email: { String, required: true },
  password: { String, required: true },
  comment: []
},{collection: 'user', strict: false})

var User = mongoose.model("user", postSchema);

module.exports = Post;
