var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var postSchema = new Schema ({
  email: String,
  date: String,
  title: String,
  content: String,
  comments: String,
},{collection: 'post', strict: false})

var Post = mongoose.model("post", postSchema);

module.exports = Post;