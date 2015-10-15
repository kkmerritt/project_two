//form posting...

<div class="form-group col-lg-12">
  <label>Comment</label>
  <textarea class="form-control" rows="6" name=post[comments] placeholder="Comment"></textarea>
</div>


<div class="form-group col-lg-12">
  <input type="hidden" name=email value="useremail">
  <button type="submit" class="btn btn-default">Submit Comment</button>
</div>


///consolelog

REQ.BODY'
{ postcomments: 'testing comment into an post. into a comment object which is an schema array.',
 email: 'useremail' }


 //using this schema...

 var mongoose = require('mongoose'),
     Schema = mongoose.Schema;

 var commentSchema = new Schema ({
     text: String,
     date: String,
     email: String
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

//with this javascript

server.post('/postdir/:id/comment', function(req, res){
  console.log("accessed the post comment route");
  Post.findById(req.params.id, function (err, thisPost) {
      if (err) {console.log("ERROR in COMMENT POST for fucks's sake."); res.redirect(302, "/404") }
      else {
        thisPost.comments.push(req.body.post) // english what? [inspiractional quote courtesy of @short_stack]
        thisPost.save(function (saveErr, savedPost) {
          if (saveErr) { console.log("ERROR in comment save....", saveErr) }
          else {res.redirect(302, '/postdir/'  + req.params.id)}
        })
      }
  });
});
