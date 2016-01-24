//initialize a project
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var fsp = require('../lib/fs-promise.js');

module.exports = function(opts){


  opts.gulp.task('init', function(){
    var labpath = 'lab/' + opts.config.labpath;
    var distpath = 'dist/' + opts.config.labpath;

    //make the directories we'll need
    var filePaths = [labpath, distpath];
    var mkdirs = filePaths.map(fsp.mkdirp);
    Promise.all(mkdirs).then(function(){
      console.log('made directories');
    }).then(function(){ //then copy starter files

      opts.gulp.src('templates/sample/_layouts/**/*.nunj')
        .pipe($.nunjucks.compile({distpath: distpath, labpath: labpath}))
        .pipe(opts.gulp.dest(labpath + '/_layouts'));


    }).catch(function(er){
      console.log(er);
    });

  });


}; //module.exports
