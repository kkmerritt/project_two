// NOTE: ----------------------  Kevin Merritt, Forum Project
// NOTE: ----------------------  This is the server.


var express    = require('express'),
  ejs        = require('ejs'),
  bodyParser = require('body-parser'),
  methodOverride = require('method-override'),
  expressLayouts = require('express-ejs-layouts'),
  // Schema     = mongoose.Schema,
  morgan     = require('morgan');

  PORT = process.env.PORT || 3000,
    server = express(),
  MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
    dbname = "project_two_db"
    mongoose = require('mongoose');


server.set('views', './views'); // tells the renderer where to find templates
server.set('view engine', 'ejs'); // tells the render method, what to use

server.use(express.static(__dirname + '/public')); //location for static files (not templates e.g. css, js, img)
server.use(bodyParser.urlencoded({extended: true})); // So we can parse incoming forms into Objects
server.use(methodOverride('_method'));
server.use(morgan('short'));
server.use(expressLayouts);



// NOTE: ---------------------- Server Functions
server.get('/', function (req, res) {
  res.render('index')
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

mongoose.connect(MONGOURI + "/" + dbname)
server.listen(PORT,function(){
  console.log("SERVER IS UP ON PORT:", PORT);
})
