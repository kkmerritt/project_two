// NOTE: ----------------------  Kevin Merritt, Forum Project
// NOTE: ----------------------  This is the server.


var express      = require('express'),
  ejs            = require('ejs'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  morgan         = require('morgan'),
  session        = require('express-session'),
  Post           = require('./models/post.js');


  PORT = process.env.PORT || 3000,
    server = express(),
  MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/users",
    dbname = "forumDB"
    mongoose = require('mongoose');


server.set('view engine', 'ejs'); // tells the render method, what to use
server.set('views', './views'); // tells the renderer where to find templates

server.use(express.static(__dirname + '/public')); //location for static files (not templates e.g. css, js, img)
server.use(bodyParser.urlencoded({extended: true})); // So we can parse incoming forms into Objects
server.use(methodOverride('_method'));
server.use(morgan('short'));
server.use(expressLayouts);

mongoose.connect(MONGOURI + "/" + dbname)
server.listen(PORT,function(){
  console.log("SERVER IS UP ON PORT:", PORT);
})
var db = mongoose.connection;

db.on('error', function(){
  console.log("DATABASE: CONNECTION ERROR: for fuck's sake. " + dbname)
})
db.once('open', function(){
  console.log("DATABASE: CONNECTED: " + dbname)
})



// NOTE: ---------------------- Server Routes
server.get('/', function (req, res) {
  res.render('index')
});

server.get('/allposts', function (req, res) {
  Post.find({}, function (err, allPosts) {
    if (err) {
      console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {
      // console.log("allPosts= ", allPosts)
      res.render('allposts', {
        post: allPosts
      });
    }
  });
});

server.get('/submitpost', function (req, res) {
  res.render('submitpost')
});

server.post('/submitpost', function (req, res) {
  var newPost = new Post(req.body.post); //throw the variable into the schema
    newPost.save(function(err, data) {
    if(err) {
      console.log("POST ENTRY ERROR: for fuck's sake. ", err)
      res.redirect(302,"/submitpost")
      ;}
    else {
      console.log("Processed a new database document", data)
      res.redirect(302, "/allposts")};
  })
});

server.post('/postdir/:id', function (req, res) {  //this is the individual page. Should display a post with comments
  var postID = req.params.id;
  Post.findById(postID, function (err, thisPost) {
    if (err) {
      console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {
      res.render('postdir/thispost', {
        post: thisPost
    })}
  });
});

server.patch('/postdir/:id', function (req, res) {
  var postOptions = req.body.post;
  Post.findByIdAndUpdate(req.params.id, postOptions, {upsert:true}, function (err, updatedPost) {
    if (err) {
      console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {
      res.redirect(302, '/postdir/' + updatedPost._id)
    }
    });
  });

  server.get('/postdir/:id', function (req, res) {  //this is the individual page. Should display a post with comments
    var postID = req.params.id;
    Post.findById(postID, function (err, thisPost) {
      if (err) {
        console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
      } else {
        res.render('postdir/thispost', {
          post: thisPost
      })}
    });
  });
