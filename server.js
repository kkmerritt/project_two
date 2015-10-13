// NOTE: ----------------------  Kevin Merritt, Forum Project
// NOTE: ----------------------  This is the server.


var express      = require('express'),
  ejs            = require('ejs'),
  bodyParser     = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  morgan         = require('morgan'),
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
Schema         = mongoose.Schema;

var postSchema = new Schema ({
                email: String,
                date: String,
                content: String,
                avatar: String,
                comments: [{ body: String, date: Date }]
              },
                {collection: 'post', strict: false})

var Post = mongoose.model("post", postSchema)

// NOTE: ---------------------- Server Routes
server.get('/', function (req, res) {  //this is the / page. Should display all the current posts.
  Post.find({}, function (err, allPosts) {
    if (err) {
      console.log("FIND DATABASE ERROR. for fuck's sake", err);   //don't fix this late.
    } else {
      // console.log("allPosts= ", allPosts)
      res.render('index', {
        post: allPosts
      });
    }
  });
});

server.get('/submit', function (req, res) {
  res.render('submit')
});

server.get('/thisuser', function (req, res) {
  res.render('thisuser')
});

server.get('/contact', function (req, res) {
  res.render('contact')
});

server.post('/submit', function (req, res) {
  newPost = new Post(req.body.post); //throw the variable into the schema
   newPost.save(function(err, data) {
    if(err) {console.log("POST ENTRY ERROR: for fuck's sake. ", err);}
    else {
      console.log("Processed a new database document", data)
      res.redirect(302, "/")};
  })
})
