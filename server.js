var express = require("express");
var app     = express();
var http    = require("http").createServer(app);
var io      = require("socket.io").listen(http);

var main    = require('./main');
var config  = require('./config');
var router  = require('./router');

var m = new main(app, io);

config(app, express);
router(app, io, m);

http.listen(app.get("port"), /*app.get("ipaddr"),*/ function() {
  console.log("Server up and running. Go to http://" + app.get("ipaddr") + ":" + app.get("port"));
});