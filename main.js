var fs = require('fs');
var glob = require("glob");
var path = require("path");
var gm = require('gm');
var mkdirp = require('mkdirp');

var db = "/Users/benoit/Dropbox/g-degre48_archives/soirees";
var thumbsPath = "/public/thumbs/"

module.exports = function(app, io){
  console.log("main module initialized");

  io.on("connection", function(socket){
    socket.on("capture", onCapture);
  });

  function init(){
   // refreshThumbs();
  };

  /*

  sets 
    performance




  */

  this.readDatabase = function(){return readDatabase();};

  function readDatabase(){

    var data = [];
    var pouf;

    glob.sync(db+'/*/p*-*', {nocase: true}).forEach(function(perfPath){

        var setPath           = path.dirname(perfPath);
        var setBasename       = path.basename(setPath);
        var setBasenameParts  = setBasename.split("-");
        var setPosition       = parseInt(setBasenameParts[0].replace("s", "")) - 1;

        var perfBasename      = path.basename(perfPath);
        var perfBasenameParts = perfBasename.split("-");
        var perfPosition      = parseInt(perfBasenameParts[0].replace("p", "")) -1;

        var versos  = getItemsList(perfPath+"/*verso*/*.pdf");
        var rectos  = getItemsList(perfPath+"/*recto*/*.pdf");
        var predocs = getItemsList(perfPath+"/*pre-doc*/*.*");


        var sourceType = []

        glob.sync(perfPath+"/*source*/*/").forEach(function (source) {
          sourceType.push(path.basename(source));
        });

        var perf = {
           setPath       : setPath
          ,setId         : setBasenameParts[0]
          ,setDate       : setBasenameParts[1]
          ,setPosition   : setPosition
          
          ,perfPath      : perfPath
          ,id            : setBasenameParts[0]+"_"+perfBasenameParts[0]
          ,position      : perfPosition
          ,title         : perfBasenameParts[1]

          ,versos        : versos
          ,versoIcon     : getRandItem(versos).thumb
          ,versoCount    : versos.length

          ,rectos        : rectos
          ,rectoIcon     : getRandItem(rectos).thumb
          ,rectoCount    : rectos.length

          ,predocs        : predocs
          ,predocIcon     : getRandItem(predocs).thumb
          ,predocCount    : predocs.length

          ,sourceType    : sourceType
        };

        data.push(perf);
    });
    
    //console.log(data);
    return data;
  };

  function getRandItem(array){
    var item = false;
    if(array.length > 0) item = array[Math.floor(Math.random()*array.length)];

    return item
  }
  function getItemsList(patern, ext){

    var items = [];

    glob.sync(patern).forEach(function (itemPath) {

      var item = {
        filename : path.basename(itemPath),
        thumb : genThumb(itemPath)
      };

      items.push(item);
    });
    return items;
  }
  function genThumb(orginPath){

    var thumb = (__dirname + thumbsPath+orginPath+".jpg").replace(db,"");

    if (! fs.existsSync(thumb)){

      mkdirp(path.dirname(thumb), function (err) {
          console.log(orginPath,"->",thumb);
          
          gm(orginPath)
          .resize(350,350)
          .write(thumb, function (err) { 
            if (err) console.error("stop",err);
          });

      });
    };
    return thumb.replace(__dirname,"").replace('/public',"");
  }

  init();
};