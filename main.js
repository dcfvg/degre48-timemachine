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
    //genPdfTumbs("/Users/benoit/Dropbox/g-degre48_archives/soirees/s01-130426/p1-ACW");
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

        genPdfTumbs(perfPath);

        var setPath           = path.dirname(perfPath);
        var setBasename       = path.basename(setPath);
        var setBasenameParts  = setBasename.split("-");
        var setPosition       = parseInt(setBasenameParts[0].replace("s", "")) - 1;

        var perfBasename      = path.basename(perfPath);
        var perfBasenameParts = perfBasename.split("-");
        var perfPosition      = parseInt(perfBasenameParts[0].replace("p", "")) -1;


        var versos = []
        var versoIcon = false

        glob.sync(perfPath+"/*versos/*.pdf").forEach(function (versoPath) {
      

          var verso = {
            filename : path.basename(versoPath),
            thumb : genThumb(versoPath)
          };

          versos.push(verso);
          
        });



        var perf = {
          setPath  : setPath,
          setId    : setBasenameParts[0],
          setDate  : setBasenameParts[1],
          setPosition : setPosition,
          
          perfPath : perfPath,
          id   : setBasenameParts[0]+"_"+perfBasenameParts[0],
          position : perfPosition,
          title : perfBasenameParts[1],

          versos : versos,
          versoIcon : versoIcon,
          versoCount : versos.length
        };

        data.push(perf);
    });
    
    //console.log(data);
    return data;
  };
  function genThumb(orginPath){

    var thumb = (__dirname + thumbsPath+orginPath+".jpg").replace(db,"");

    if (! fs.existsSync(thumb)){

      mkdirp(path.dirname(thumb), function (err) {
          console.log(orginPath,"->",thumb);
          
          gm(orginPath)
          .resize(200,200)
          .write(thumb, function (err) { 
            if (err) console.error("stop",err);
          });

      });
    };
    return thumb.replace(__dirname,"").replace('/public',"");
  }
  function genPdfTumbs(perfPath){
    //console.log(perfPath);

    glob(perfPath+'/*versos/*.pdf', {nocase: true, sync: true}, function (er, pdfs) {
      pdfs.forEach(function(pdf){
        
        var thumbPath = (__dirname + thumbsPath+pdf+".jpg").replace(db,"");

        if (! fs.existsSync(thumbPath)){
          mkdirp(path.dirname(thumbPath), function (err) {
              console.log(pdf,"->",thumbPath);
              gm(pdf)
              .resize(350,350)
              .write(thumbPath, function (err) { 
                if (err) console.error("stop",err);
              });
          });
        };        
      });
    });
  }
  init();
};