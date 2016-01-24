
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

//the db object
var fspromise = {
  mkdirp : mkdirpAsync

};

module.exports = fspromise;
