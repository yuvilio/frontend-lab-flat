
var fs = require('fs');
var mkdirp = require('mkdirp');

var mkdirpAsync = function(path){
  return new Promise(function(resolve, reject){
    mkdirp(path, function (err) {
        if (err) reject(err)
        else resolve();
    });
  });
};

//Check if a file exists. Returns promise.
var pathExistsAsync = function(path){

  return new Promise(function(resolve, reject){
      fs.stat(path, function(err, stat) {
          if (err !== null)  reject('File path ' + path + ' not present. ' + err ); //file does not exist
          else resolve(); //file exists. report success
      }); //fs.stat
  });

};

//the db object
var fspromise = {
  mkdirp : mkdirpAsync,
  stat: pathExistsAsync
};

module.exports = fspromise;
