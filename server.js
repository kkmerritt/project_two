// NOTE: ----------------------  Kevin Merritt
// NOTE: ----------------------  Forum Project
// NOTE: ----------------------  Server.js

var express      = require('express'),
  ejs            = require('ejs'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  morgan         = require('morgan'),
  session        = require('express-session'),
  Post           = require('./models/post.js');

  PORT = process.env.PORT || 3000, server = express(),
  MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/users",
    dbname = "forumDB", mongoose = require('mongoose');

// NOTE: ---------------------- Activate / Use Middleware
server.set('view engine', 'ejs'); // tells the render method, what to use
server.set('views', './views'); // tells the renderer where to find templates

server.use(session({
  secret: "password",
  resave: true,
  saveUninitialized: false
}));


server.use(express.static(__dirname + '/public')); //location for static files (not templates e.g. css, js, img)
server.use(bodyParser.urlencoded({extended: true})); // So we can parse incoming forms into Objects
server.use(methodOverride('_method'));
server.use(morgan('short'));
server.use(expressLayouts);

// NOTE: ---------------------- Server & Database Connections
mongoose.connect(MONGOURI + "/" + dbname)
server.listen(PORT,function(){console.log("SERVER IS UP ON PORT:", PORT);})

var db = mongoose.connection;
db.on('error', function(){console.log("DATABASE: CONNECTION ERROR: for fuck's sake. " + dbname)})
db.once('open', function(){console.log("DATABASE: CONNECTED: " + dbname)})

//NOTE  ----------------logger-----------------//
server.use(function (req, res, next){
  console.log("--------------------REQ START-----------\n");
  console.log("REQ DOT BODY\n", req.body);
  console.log("REQ DOT PARAMS\n", req.params);
  console.log("REQ DOT SESSION\n", req.session);
  console.log("--------------------REQ END-----------\n");
  next()
});


// NOTE: ---------------------- Server Routes
server.get('/', function(req, res){res.render('index')});

server.get('/allposts', function(req, res){
  Post.find({}, function(err, allPosts){
    if (err){console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {res.render('allposts', {post: allPosts});}
  });
});

server.get('/submitpost', function(req, res){res.render('submitpost')});

server.post('/submitpost', function(req, res){
  var newPost = new Post(req.body.post); //throw the variable into the schema
  newPost.save(function(err, data){
  if(err){console.log("POST ENTRY ERROR: for fuck's sake. ", err), res.redirect(302,"/submitpost");}
  else {console.log("Processed a new database document", data), res.redirect(302, "/allposts")};
  })
});

// an individual post no creation
// server.post('/postdir/:id', function(req, res){//this is the individual page. Should display a post with comments
//   var postID = req.params.id;
//   Post.findById(postID, function(err, thisPost){
//     if (err){console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
//     } else {res.render('postdir/thispost', {post: thisPost })}
//   });
// });

server.post('/postdir/:id/comment', function(req, res){
  console.log("accessed the post comment route");
  Post.findById(req.params.id, function (err, foundPost) {
      if (err) { console.log("ERRbody in the club..", err) }
      else {
        foundPost.comment.push(req.body.post.comment) // english what? [inspiractional quote courtesy of @short_stack]
        foundPost.save(function (saveErr, savedPost) {
          if (saveErr) { console.log("MORE ERR", saveErr) }
          else {
            res.redirect(302, '/postdir/'  + req.params.id)
          }
        })
      }
  });
});

// an individual post no creation
server.get('/postdir/:id', function(req, res){
  var postID = req.params.id;
  Post.findById(postID, function(err, thisPost){
    if (err){console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {res.render('postdir/thispost', {post: thisPost})}
  });
});
