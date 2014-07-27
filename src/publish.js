// Generated by CoffeeScript 1.7.1
(function() {
  var Promise, async, concurrency, convert2HTML, fs, htmlPath, initHTML, marked, mustache, pageTemplate, path, postsPath, renameFile;

  Promise = require('bluebird');

  async = require('async');

  marked = require('marked');

  mustache = require('mustache');

  fs = require('fs');

  path = require('path');

  Promise.promisifyAll(fs);

  postsPath = "" + __dirname + "/../posts";

  htmlPath = "" + __dirname + "/../html";

  concurrency = 5;

  pageTemplate = fs.readFileSync("" + __dirname + "/template.html", "utf8");

  renameFile = function(filename) {
    return path.basename(filename, '.md') + ".html";
  };

  initHTML = function(filename, mdOutput) {
    var pieces, title;
    pieces = filename.split("-");
    title = pieces.slice(3).join(' ') + " @ " + pieces.slice(0, 3).join('-');
    return mustache.render(pageTemplate, {
      title: title,
      body: mdOutput,
      stylesheets: ["../themes/darcula/index.css"],
      scripts: []
    });
  };

  convert2HTML = function(filename, next) {
    var filePath;
    filePath = postsPath + ("/" + filename);
    return fs.readFileAsync(filePath, 'utf8').then(function(content) {
      var newPath;
      newPath = htmlPath + "/" + renameFile(filename);
      return fs.writeFileAsync(newPath, initHTML(filename, marked(content)));
    }).then(next)["catch"](function(err) {
      console.log("got an error when converting " + filename);
      console.error(err);
      return next();
    });
  };

  fs.readdirAsync(postsPath).then(function(files) {
    console.log("you have wrote " + files.length + " articles via markdown.");
    return async.eachLimit(files, concurrency, convert2HTML, function(err) {
      return console.log("task finished.");
    });
  })["catch"](function(err) {
    console.log("oops, some error happened.");
    throw err;
  });

}).call(this);
