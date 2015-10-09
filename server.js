var express = require('express'),
  PORT = process.env.PORT || 6667,
  server = express();

  server.get('/test', function(req, res){
    res.write("fuck off");
    res.end();
  });

  server.listen(PORT,function(){
    console.log("SERVER IS UP ON PORT:", PORT);
  })
