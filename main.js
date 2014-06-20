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

    // glob(db+'/*/m*', {nocase: true, sync: true}, function (er, sets) {
    //   sets.forEach(function(setPath){
    //     var setBasename = path.basename(setPath);
    //     var setBasenameParts = setBasename.split("-");
        
    //     glob(setPath+'/*/', {nocase: true, sync: true}, function (er, perfs) {
    //       return perfs;

    //       var set = {
    //         id    : setBasenameParts[0],
    //         date  : setBasenameParts[1],
    //         perfs : perfs
    //       };
    //     });
    //     data.push(set);
      
    //   });

    //   console.log(data);
    // });
    glob(db+'/*/p*-*', {nocase: true, sync: true}, function (er, perfs) {
      console.log(perfs);

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
          perfPosition : perfPosition
        };
        console.log(perf);
      });
    });
  };


  init();
};