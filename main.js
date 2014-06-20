var fs = require('fs');
var glob = require("glob");
var path = require("path");
var gm = require('gm');

var db = "/Users/benoit/Dropbox/g-degre48_archives/soirees";

module.exports = function(app, io){
  console.log("main module initialized");

  io.on("connection", function(socket){
    socket.on("capture", onCapture);
  });

  function init(){
    readDatabase();
  };

  /*

  sets 
    performance




  */

  this.readDatabase = function(){return readDatabase();};

  function readDatabase(){

    var data = [];

    glob(db+'/*/', {nocase: true, sync: true}, function (er, sets) {
      sets.forEach(function(setPath) {

        var setBasename = path.basename(setPath);
        var setBasenameParts = setBasename.split("-");

        var set = {
          id    : setBasenameParts[0],
          date  : setBasenameParts[1]
        };

        data.push(set);

      });

      console.log(data);
    });

  };
  init();
};