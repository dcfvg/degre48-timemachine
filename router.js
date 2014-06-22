var _ = require("underscore");
var url = require('url')
var fs = require('fs');

module.exports = function(app,io,m){

  /**
  * routing event
  */

  app.get("/", getIndex);
  app.get("/sets", getSets);
  /**
  * routing functions
  */

  // GET
  function getIndex(req, res) {
    res.render("index", {title : "48", perfs:m.readPerfs()});
  };
  
  function getSets(req, res) {
    res.render("sets", {title : "48", sets:m.readSets()});
  };
};
