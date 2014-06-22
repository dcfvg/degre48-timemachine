var fs = require('fs');
var glob = require("glob-all");
var path = require("path");
var gm = require('gm');
var mkdirp = require('mkdirp');
var markdown = require( "markdown" ).markdown;
var _ = require("underscore");


var db = "/Users/benoit/Dropbox/g-degre48_archives/soirees";
var thumbsPath = "/public/thumbs/"

module.exports = function(app, io){
  console.log("main module initialized");

  var thumbList;
  var thumbCurrentRender = 0;

  function init(){
    refreshTumbList()
    renderNextThumb();
  };

  this.readPerfs = function(){return readPerfs();};
  function readPerfs(){

    var perfs = [];

    glob.sync(db+'/*/p*-*').forEach(function(perfPath){

        var setPath           = path.dirname(perfPath);
        var setBasename       = path.basename(setPath);
        var setBasenameParts  = setBasename.split("-");
        var setPosition       = parseInt(setBasenameParts[0].replace("s", "")) - 1;

        var perfBasename      = path.basename(perfPath);
        var perfBasenameParts = perfBasename.split("-");
        var perfPosition      = parseInt(perfBasenameParts[0].replace("p", "")) -1;

        var versos  = getItemsList(perfPath+"/*verso*/","*.pdf");
        var rectos  = getItemsList(perfPath+"/*recto*/","*.pdf");
        var predocs = getItemsList(perfPath+"/*pre-doc*/","*.*");


        var sourceType = []

        glob.sync(perfPath+"/*source*/*/").forEach(function (source) {
          sourceType.push(path.basename(source));
        });

        var perf = {
           setPath       : setPath
          ,setId         : setBasenameParts[0]
          ,setDate       : parseDate(setBasenameParts[1])
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

        perfs.push(perf);
    });
    
    //console.log(perfs);
    return perfs;
  };
  this.readSets = function(){return readSets();};
  function readSets(){

    var sets = [];

    glob.sync(db+'/s*-*').forEach(function(setPath){
      
        var setBasename       = path.basename(setPath);
        var setBasenameParts  = setBasename.split("-");
        var setPosition       = parseInt(setBasenameParts[0].replace("s", "")) - 1;

        var docs              = getItemsList(setPath+"/*documentation*/","*.*");
        var dispositifs       = getItemsList(setPath+"/*dispositif*/","*.*");

        
        var readmeMd = fs.readFileSync(setPath + "/dispositif/degre48/README.md", 'utf8');
        var readme   = {
          html              : markdown.toHTML(readmeMd),
          md                : readmeMd 
        };

        var set = {
           setPath          : setPath
          ,setId            : setBasenameParts[0]
          ,setDate          : parseDate(setBasenameParts[1])
          ,setPosition      : setPosition

          ,docs             : docs
          ,docIcon          : getRandItem(docs).thumb
          ,docCount         : docs.length

          ,dispositifs      : dispositifs
          ,dispositifIcon   : getRandItem(dispositifs).thumb
          ,dispositifCount  : dispositifs.length

          ,readme           : readme

        };

        sets.push(set);
    });

    return sets;
  };

  function renderNextThumb(){

    thumbCurrentRender++;

    if(thumbCurrentRender < thumbList.length){
      genThumb(thumbList[thumbCurrentRender]);
    }else{
      refreshTumbList();
      console.log('next thumbs scan in 30 sec.')
      setTimeout(renderNextThumb, 30000);
    };
  }
  function refreshTumbList(){
    thumbList = glob.sync([
       db+'/*/*/*verso*/*.pdf'
      ,db+'/*/*/*recto*/*.pdf'
      ,db+'/*/*/*pre-doc*/*.*'
      ,db+'/*/*documentation*/*.*'
      ,db+'/*/*dispositif*/*.*'
    ]);

    console.log('file', thumbList.length)
  }
  function parseDate(str){
    //var date = new Date(str.substr(4,2), str.substr(2,2), str.substr(0,2), 0, 0, 0 );
    var date = str.substr(4,2)+'/'+str.substr(2,2)+'/'+str.substr(0,2);
    return date;
  }
  function getRandItem(array){
    var item = false;
    if(array.length > 0) item = array[Math.floor(Math.random()*array.length)];

    return item
  };
  function getItemsList(searchPath, patern){

    var items = [];
    glob.sync([
           searchPath+'/'+patern
      ,'!'+searchPath+'/*.doc*'
      ,'!'+searchPath+'/*.indd'
      ,'!'+searchPath+'/*.rtf'
      ,'!'+searchPath+'/*.mp3'
      ,'!'+searchPath+'/*.rtf'
      ,'!'+searchPath+'/*.textClipping'
    ])
    .forEach(function (itemPath) {
      console.log(itemPath);

      var item = {
        filename : path.basename(itemPath),
        thumb : genThumbUrl(itemPath)
      };

      items.push(item);
    });
    return items;
  };
  function genThumbUrl(orginPath){
    return (__dirname + thumbsPath+orginPath+".jpg").replace(db,"").replace(__dirname,"").replace('/public',"");
  };
  function genThumb(orginPath){

    var thumb = (__dirname + thumbsPath+orginPath+".jpg").replace(db,"");

    if (! fs.existsSync(thumb)){

      mkdirp(path.dirname(thumb), function (err) {
          console.log(thumbCurrentRender,'/', thumbList.length, path.basename(orginPath),"->",path.basename(thumb));
          
          gm(orginPath)
          .resize(450,450)
          .autoOrient()
          .write(thumb, function (err) { 
            if (err) console.error("stop",err);
            renderNextThumb();
          });

      });
    }else{
      renderNextThumb();
    };
    return thumb.replace(__dirname,"").replace('/public',"");
  };
  init();
};