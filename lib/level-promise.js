//promisifying wrapper around

//writing to the db
var putAsync = function(db, key, val){
  return new Promise(function(resolve, reject){
    //put some value
    db.put(key, val, function (err) {
      if (err) reject( 'Put did not work, ' , err )
      else resolve();
    });
  });
};



//get key from leveldb database
var getKeyAsync = function(db, key){
  return new Promise(function(resolve, reject){
      db.get(key, function(err, value){
        if (err) reject('Get did not work ', err)
        else resolve(value);
      });
  });
};


var delKeyAsync = function(db, key){
    return new Promise(function(resolve, reject){
      db.del(key, function (err) {
        if (err) reject('del of key ' + key + ' did not work ', err)
        else resolve();

      });
    });
};

//the db object
var levelpromise = {
  'del' : delKeyAsync,
  'get' : getKeyAsync,
  'put' : putAsync,

};

module.exports = levelpromise;
