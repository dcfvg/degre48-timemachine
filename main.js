var fs = require('fs');
var glob = require("glob");
var path = require("path");
var gm = require('gm');

module.exports = function(app, io){
  console.log("main module initialized");

  io.on("connection", function(socket){
    socket.on("capture", onCapture);
  });

  function init(){
  };


  this.getSessionsList = function(){ return getSessionsList();};
  function getSessionsList(){
    var folders = fs.readdirSync(sessions_p);
    folders = folders.filter(function(f){ return fs.statSync(sessions_p+f).isDirectory(); });
    return folders;
  };

  init();
};