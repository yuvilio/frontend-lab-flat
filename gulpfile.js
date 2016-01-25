var gulp = require("gulp");
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var browserSync = require("browser-sync");

var config = require('./lab-config.json'); //get settings from here
var labpath = 'lab/' + config.labpath;
var distPath = './dist/' + config.labpath;
var batch = config.labpath.split("/")[0]; //just the batch part
var batchLabPath = "lab/" + batch; //handy for common css/js for more than one example

//tasks
require('./gulp-tasks/init.js')( {gulp: gulp, config: config } );
require('./gulp-tasks/templates.js')( {gulp: gulp, config: config } );
require('./gulp-tasks/styles.js')( {gulp: gulp, config: config } );
require('./gulp-tasks/scripts.js')( {gulp: gulp, config: config } );



gulp.task('server', function () {
  return browserSync.init(['dist/**/*'], {
    server: {
      // baseDir: distPath,
      'proxy': 'frontend-lab-flat.dev'
    },
    port: (config.browserSync.port || 3000), 
    open: false
  });
});

//tasks of tasks
gulp.task('watch', function(){
  gulp.watch([labpath + '/**/*.md', labpath + '/_layouts/**/*.nunj'], ['templates', browserSync.reload]);
  gulp.watch( [ batchLabPath + '/assets/scss/**/*.scss', labpath + '/assets/scss/**/*.scss'], ['styles']);
  gulp.watch([batchLabPath + '/assets/js/**/*.js', labpath + '/assets/js/**/*.js'], ['scripts', browserSync.reload]);
});

gulp.task('build', ['templates', 'styles', 'scripts' ]); //carrying out the build

gulp.task('default',  ['build', 'server', 'watch']); //build and watch
