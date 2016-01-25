//initialize a project
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var fsp = require('../lib/fs-promise.js');

module.exports = function(opts){


  opts.gulp.task('init', function(){
    var labpath = 'lab/' + opts.config.labpath;
    var distpath = 'dist/' + opts.config.labpath;

    var batch = opts.config.labpath.split("/")[0]; //just the batch part
    var batchLabPath = "lab/" + batch; //handy for common css/js for more than one example
    opts.config.batch = batch;
    opts.config.batchLabPath = batchLabPath;

    //make the directories we'll need
    var filePaths = [labpath, distpath, batchLabPath + "/assets/bower_components" ];
    var mkdirs = filePaths.map(fsp.mkdirp);
    Promise.all(mkdirs).then(function(){
      console.log('made directories');
    }).then(function(){ //then copy starter files

      //per batch assets (only run if they don't already exist since they might have been edited since)
      fsp.stat(batchLabPath + "/batch-config.json").catch(function(){

        opts.gulp.src('templates/sample/batch-config.json')
          .pipe(opts.gulp.dest(batchLabPath));

        opts.gulp.src(['templates/sample/.bowerrc', 'templates/sample/bower.json'])
          .pipe(opts.gulp.dest(batchLabPath));

        //batch level stylesheet
        opts.gulp.src(['templates/sample/batch/assets/scss/**/*.scss'])
          .pipe(opts.gulp.dest(batchLabPath + '/assets/scss'));

      });


      //copy some files
      opts.gulp.src('templates/sample/_layouts/**/*.nunj')
        .pipe($.nunjucks.compile({distpath: distpath, labpath: labpath}))
        .pipe(opts.gulp.dest(labpath + '/_layouts'));

      opts.gulp.src('templates/sample/**/*.md')
        .pipe($.nunjucks.compile({distpath: distpath, labpath: labpath}))
        .pipe(opts.gulp.dest(labpath));

      //per lab assets
      opts.gulp.src(['templates/sample/.bowerrc', 'templates/sample/bower.json'])
        .pipe(opts.gulp.dest(labpath));


      opts.gulp.src('templates/sample/assets/**/*.{js,json,scss,svg}')
        .pipe($.nunjucks.compile({distpath: distpath, labpath: labpath}))
        .pipe(opts.gulp.dest(labpath + '/assets/'));

      opts.gulp.src('templates/sample/assets/**/*.{js,json,scss,svg}')
        .pipe(opts.gulp.dest(labpath + '/assets/'));

      opts.gulp.src('templates/sample/data/**/*.{json,yaml}')
        .pipe(opts.gulp.dest(labpath + '/data/'));



    }).catch(function(er){
      console.log(er);
    });

  });


}; //module.exports
