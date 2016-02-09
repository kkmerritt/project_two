var mongoose = require('mongoose'),
Schema = mongoose.Schema;

var commentSchema = new Schema ({
  text: String,
  email: String,
  date: String
});

var postSchema = new Schema ({
  email: String,
  date: String,
  title: String,
  content: String,
  votes: Number,
  comments: [commentSchema]
},{collection: 'post', strict: false})

var Post = mongoose.model("post", postSchema);

module.exports = Post;
