var gulp = require("gulp");
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var browserSync = require("browser-sync");

var config = require('./lab-config.json'); //get settings from here
var labPath = './lab/' + config.labpath;
var distPath = './dist/' + config.labpath;


//tasks
require('./gulp-tasks/templates.js')( {gulp: gulp, config: config } );
require('./gulp-tasks/styles.js')( {gulp: gulp, config: config } );
require('./gulp-tasks/scripts.js')( {gulp: gulp, config: config } );


gulp.task('server', function () {
  return browserSync.init(['dist/**/*'], {
    server: {
      baseDir: distPath,
      'proxy': 'frontend-lab-flat.dev'
    },
    open: false
  });
});

//tasks of tasks
gulp.task('watch', function(){
  gulp.watch([labPath + '/**/*.md', labPath + '/_layouts/**/*.nunj'], ['templates', browserSync.reload]);
  gulp.watch(labPath + '/assets/scss/**/*.scss', ['styles']);
  gulp.watch(labPath + '/assets/js/**/*.js', ['scripts', browserSync.reload]);
});

gulp.task('build', ['templates', 'styles', 'scripts' ]); //carrying out the build

gulp.task('default',  ['build', 'server', 'watch']); //build and watch
