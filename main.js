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
    console.log(readDatabase());
  };

  /*

  sets 
    performance




  */

  this.readDatabase = function(){return readDatabase();};

  function readDatabase(){

    var data = [];

    glob(db+'/*/p*-*', {nocase: true, sync: true}, function (er, perfs) {
      perfs.forEach(function(perfPath){

        var setPath           = path.dirname(perfPath);
        var setBasename       = path.basename(setPath);
        var setBasenameParts  = setBasename.split("-");
        var setPosition       = parseInt(setBasenameParts[0].replace("s", "")) - 1;

        var perfBasename      = path.basename(perfPath);
        var perfBasenameParts = perfBasename.split("-");
        var perfPosition      = parseInt(perfBasenameParts[0].replace("p", "")) -1;


        var perf = {
          setId    : setBasenameParts[0],
          setDate  : setBasenameParts[1],
          setPosition : setPosition,
          
          perfId   : setBasenameParts[0]+"_"+perfBasenameParts[0],
          perfPosition : perfPosition,
          perfTile : perfBasenameParts[1]
        };

        data.push(perf);
      });
    });
    
    return data;
  };

  init();
};