//NOTE  ----------------logger-----------------//
var eyes           = require('eyespect');

var logger = function (req, res, next){
  eyes.inspect("--------------------REQ START-----------\n");
  eyes.inspect("REQ.BODY");
  eyes.inspect(req.body);
  eyes.inspect("REQ DOT PARAMS\n");
  eyes.inspect(req.params);
  eyes.inspect("REQ DOT SESSION\n");
  console.log(req.session)
  eyes.inspect("--------------------REQ END-----------\n");
  next()
};

module.exports = logger;
