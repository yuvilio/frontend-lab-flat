var gulp = require('gulp');
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var preprocess = require('gulp-preprocess');
var sass = require('gulp-sass');
var autoprefixer = require('gulp-autoprefixer');
var minimist = require('minimist');
var browserSync = require("browser-sync"); //the running browserSync instance from gulpfile.js will be picked up and used here


module.exports = function(opts){


  opts.gulp.task('styles', [], function(){

      var labPath = './lab/' + opts.config.labpath;
      var distPath = './dist/' + opts.config.labpath;
      var batch = opts.config.labpath.split("/")[0]; //just the batch part
      var batchLabPath = "lab/" + batch; //handy for common css/js for more than one example
      var batchConfig = require('../' + batchLabPath + '/batch-config.json');

      var sassOptions = {
        // outputStyle: 'expanded',
        //make vendor stylesheet paths relatively importable from in scss
        includePaths: batchConfig.sassIncludePaths.concat( opts.config.sassIncludePaths )
      };

      var sourcemapsOptions = {
        debug: false, // turn on for more guidance if not working
        // sourceMappingURLPrefix: 'https://asset-host.example.com/assets'
        // sourceMappingURL: function(file) {
        //   return 'https://asset-host.example.com/' + file.relative + '.map';
        // }
      };

      return opts.gulp.src( labPath + '/assets/scss/main.scss')
      .pipe($.sourcemaps.init())
      .pipe(preprocess({context: { env: 'dev' }})) //make scss aware of environment
      .pipe(sass(sassOptions).on('error', sass.logError))
      .pipe(autoprefixer('last 2 version'))
      .pipe($.sourcemaps.write('./', sourcemapsOptions)) //write to same directory as generated css
      .pipe(gulp.dest(distPath + '/assets/css'))
      .pipe(browserSync.stream()); //inject the changed stylesheet rather than reloading the page

  });

  //if self hosting any fonts
  opts.gulp.task('fonts', function(){
    return gulp.src(labPath + '/fonts/**/*').pipe(gulp.dest(distPath + '/assets/fonts'));
  });


  //Generate svg sprite sheets. We can use ajax to inject the resulting svg file
  opts.gulp.task('sprites', function(){
    var config                  = {
      mode                    : {
          stack               : true      // Create a «stack» sprite
      }
    };

    gulp.src('./src/assets/img/*.svg')
      .pipe($.svgSprite( config ))
      .pipe(gulp.dest('./dist/assets/img'));
  });

}; //module exports

// //parse command line options
// //ex: gulp --env production
// var knownOptions = {
//   string: ['env'], //ex.: --env production
//
//   //for each item, if theyh didn't pass an option, we'll default to one of these
//   default: {
//     env: 'development',
//   }
// };
// var options = minimist(process.argv.slice(2), knownOptions);
//
//

//

//
// // optimizinng images:
// // gulp.task('images', function() {
// //   return gulp.src('./src/img/**/*')
// //     .pipe(imagemin({
// //       progressive: true,
// //       use: [pngquant()]
// //     }))
// //     .pipe(gulp.dest('dist/assets/img'))
// // });
//
//
//
