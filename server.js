// NOTE: ----------------------  Kevin Merritt
// NOTE: ----------------------  Forum Project
// NOTE: ----------------------  Server.js

// NOTE:      current user to be used throughout site:     login/email: req.session.currentUser

var express      = require('express'),
  ejs            = require('ejs'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  morgan         = require('morgan'),
  session        = require('express-session'),
  Post           = require('./models/post.js'),
  User           = require('./models/user.js'),
  logger         = require('./misc/logger.js'),
  eyes           = require('eyespect');

PORT = process.env.PORT || 3000, server = express(),
MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/users",
  dbname = "forumDB", mongoose = require('mongoose');

// NOTE: ---------------------- Activate / Use Middleware
server.set('view engine', 'ejs'); // tells the render method, what to use
server.set('views', './views'); // tells the renderer where to find templates

server.use(session({
  secret: "1234",
  resave: true,
  saveUninitialized: true
}));

server.use(express.static(__dirname + '/public')); //location for static files (not templates e.g. css, js, img)
server.use(bodyParser.urlencoded({extended: true})); // So we can parse incoming forms into Objects
server.use(methodOverride('_method'));
server.use(morgan('dev'));
server.use(expressLayouts);


// NOTE: ---------------------- Server & Database Connections
mongoose.connect(MONGOURI + "/" + dbname)
server.listen(PORT,function(){console.log("SERVER IS UP ON PORT:", PORT);})

var db = mongoose.connection;
db.on('error', function(){console.log("DATABASE: CONNECTION ERROR: for fuck's sake. " + dbname)})
db.once('open', function(){console.log("DATABASE: CONNECTED: " + dbname)})


// NOTE: ---------------------- Server Routes

server.use(logger);

server.get('/', function(req, res){res.render('index');});
server.get('/404', function(req,res){res.render('404')})//error page.

//log off function, destroys local variables and the session. restricts commenting / post submission
server.get('/logoff', function(req,res){
  req.session.destroy();
  server.locals.username = null;
  res.render('logoff')
})

// display the submit user form (initial page)
// construct a new user object, upload to DB.
// set the session, so that the user (.email) persists throughout website
server.post('/', function(req, res){
  var thisLogin = req.body.user;
  User.findOne({email: thisLogin.email}, function(err, thisUser){
      if (thisUser && thisUser.password === thisLogin.password){
        req.session.currentUser = thisUser.email;
        server.locals.username = thisUser.email;
        res.render("welcome")
    } else {
      console.log("user sign in failed.");
      res.redirect(302, '/404');
    }
  });
});


// display all the posts, does not require login
server.get('/allposts', function(req, res){
  Post.find({}, function(err, allPosts){
    if (err){console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {res.render('allposts', {post: allPosts});}
  });
});

// display the submit post form
// construct a new post item, upload to DB.
server.get('/submitpost', function(req, res){
if (req.session.currentUser){res.render('submitpost')
} else { res.redirect(302,"/"); }
});

server.post('/submitpost', function(req, res){
  var newPost = new Post(req.body.post);
  newPost.save(function(err, data){
  if(err){console.log("POST ENTRY ERROR: for fuck's sake. ", err), res.redirect(302,"/404");}
  else {console.log("Processed a new database document", data), res.redirect(302, "/allposts")};
  })
});

// post a comment to a post
server.post('/postdir/:id/comment', function(req, res){
  console.log("accessed the post comment route");
  Post.findById(req.params.id, function (err, thisPost) {
      if (err) {console.log("ERROR in COMMENT POST for fucks's sake."); res.redirect(302, "/404") }
      else {
        var x = req.body.comment;
        var y = req.body.email;

        thisPost.comments.push(req.body);
        thisPost.save(function (saveErr, savedPost) {
          if (saveErr) { console.log("ERROR in comment save....", saveErr) }
          else {res.redirect(302, '/postdir/'  + req.params.id)}
        })
      }
  });
});


// get an individual post, see comments
server.get('/postdir/:id', function(req, res){
  var postID = req.params.id;
  Post.findById(postID, function(err, thisPost){
    if (err){console.log("FIND POST DATABASE ERROR. for fuck's sake", err);   //don't fix this later
    } else {res.render('postdir/thispost', {post: thisPost})}
  });
});

// display the submit user form
//
server.get('/userdir/newuser', function(req,res){
  if (req.session.currentUser){ res.render("welcome")}
  else {res.render('userdir/newuser');}
});

server.post('/userdir/newuser', function(req, res){
  var newUser = new User(req.body.user);
  newUser.save(function(err, thisUser){
    if(err){console.log("NEW USER ENTRY ERROR: for fuck's sake. "), res.redirect(302,"/userdir/newuser");}
    else {console.log("Processed a new database user document", thisUser), res.redirect(302, "/userdir/"+ thisUser._id)};
  })
})
//displays the users page.
server.get('/userdir/:id', function(req, res){
  if (req.session.currentUser){
    var thisLogin = req.session.currentUser;
    Post.find({ email: thisLogin }, function(err, userPosts){
      User.findOne({email: thisLogin}, function(err, thisUser){
        res.locals.currentUserID = thisUser;
        res.render('userdir/thisuser', {user: thisUser,
                                        post: userPosts}
                )})
              })
  } else {
    res.redirect(302, '/')}
})
