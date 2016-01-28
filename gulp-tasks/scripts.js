var gulp       = require('gulp');
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var browserSync = require("browser-sync");

module.exports = function(opts){

  //vendor libraries
  opts.gulp.task('scripts', function() {

      var labPath = './lab/' + opts.config.labpath;
      var distPath = './dist/' + opts.config.labpath;
      var batch = opts.config.labpath.split("/")[0]; //just the batch part
      var batchLabPath = "lab/" + batch; //handy for common css/js for more than one example

      //supplying the js files for the page comes from the batch + the lab

      var batchConfig = require('../' + batchLabPath + '/batch-config.json');

      return opts.gulp.src(
        batchConfig.jsIncludePaths.concat(opts.config.jsIncludePaths).concat([ labPath + 'assets/js/main.js'])
        // [
        // 'bower_components/jquery/dist/jquery.js',
        //
        // /* zurb foundation */
        // './bower_components/foundation-sites/dist/foundation.js',
        // // './bower_components/foundation-sites/js/foundation.core.js',
        // // './bower_components/foundation-sites/js/foundation.tabs.js',
        //
        // /* modernizr . generated from a modernizr-config.json fils (see assets/js) and placed in */
        // './bower_components/modernizr/modernizr.js',
        //
        // /* highlight.js. generated from the repository: node tools/build.js -n -t browser bash css diff ... */
        // './bower_components/highlight.js/highlight.pack.js',
        //
        // labPath + '/assets/js/main.js'
        // ]
       )
       .pipe($.concat('all.js'))
          // .pipe($.uglify())
          // .pipe($.if(isProduction, $.stripDebug()))
          .pipe(gulp.dest(distPath + '/assets/js'))
          .pipe(browserSync.stream());
  });

}; //module.exports



// var src  = './src/assets/js/';
