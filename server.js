// NOTE: ----------------------  Kevin Merritt, Forum Project
// NOTE: ----------------------  This is the server.


var express      = require('express'),
  ejs            = require('ejs'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  morgan         = require('morgan');
  session        = require('express-session');


  PORT = process.env.PORT || 3000,
    server = express(),
  MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017/users",
    dbname = "forumDB"
    mongoose = require('mongoose');


server.set('views', './views'); // tells the renderer where to find templates
server.set('view engine', 'ejs'); // tells the render method, what to use

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
  console.log("DATABASE: CONNECTION ERROR: " + dbname)
})
db.once('open', function(){
  console.log("DATABSE: CONNECTED: " + dbname)
})


// NOTE: ---------------------- DATABASE
var Post = mongoose.model("post",{
            author: String,
            date: String,
            content: String,
});

// NOTE this is for testing only ---------------------------------------
// var newPost = new Post({       //test post.
//   author: "Kevin Test",
//   content: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
// });
//
// newPost.save(function(err, post){
//   if (err){
//     console.log("POST ERROR");
//     console.log(err);
//   } else {
//     console.log("POST SAVED");
//     console.log(post)
//   }
// })
// NOTE this is for testing only ---------------------------------------

// NOTE: ---------------------- Server Routes
server.get('/', function (req, res) {  //this is the / page. Should display all the current posts.
  Post.find({}, function (err, allPosts) {
    if (err) {
      console.log("ERROR. for fuck sakes", err);   //don't fix this late.
    } else {
      console.log("allPosts= ", allPosts)
      res.render('index', {
        post: allPosts
      });
    }
  });
});

server.get('/submit', function (req, res) {
  res.render('submit')
});

server.get('/user', function (req, res) {
  res.render('user')
});

server.get('/contact', function (req, res) {
  res.render('contact')
});

server.post('/submit', function (req, res) {
  newPost = new Post(req.body.post); //throw the variable into the schema
   newPost.save(function(err, data) {
    if(err) {console.log("POST ENTRY ERROR: ", err);}
    else {
      console.log("Processed a new database document", data)
      res.redirect(302, "/")};
  })
})
