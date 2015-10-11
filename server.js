var express = require('express'),
  PORT = process.env.PORT || 6667,
  server = express(),
  MONGOURI = process.env.MONGOLAB_URI || "mongodb://localhost:27017",
  dbname = "project_two_db"
  mongoose = require('mongoose');

  
  server.use(express.static('public'));

  server.get('/test', function(req, res){
    res.write("fuck off");
    res.end();
  });




mongoose.connect(MONGOURI + "/" + dbname)
  server.listen(PORT,function(){
    console.log("SERVER IS UP ON PORT:", PORT);
  })
