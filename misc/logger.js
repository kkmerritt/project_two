//NOTE  ----------------logger-----------------//


var logger = function (req, res, next){
  console.log("--------------------REQ START-----------\n");
  console.log("REQ DOT BODY\n", req.body);
  console.log("REQ DOT PARAMS\n", req.params);
  console.log("REQ DOT SESSION\n", req.session);
  console.log("--------------------REQ END-----------\n");
  next()
};

module.exports = logger;
