module.exports = function(app,express){

  app.set("port", 4848); //Server's port number
  app.set("views", __dirname + "/views"); //Specify the views folder
  app.set("view engine", "jade"); //View engine is Jade
  app.use(express.static(__dirname + "/public"));
  app.use(express.static("/Users/benoit/Dropbox/g-degre48_archives/soirees/")); 
  app.use(express.bodyParser()); //Tells server to support JSON, urlencoded, and multipart requests

}