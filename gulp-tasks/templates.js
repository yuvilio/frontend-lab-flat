var _                 = require('lodash');
var $ = require('gulp-load-plugins')(); //make plugins available in $.
var gulpsmith         = require('gulpsmith');
var gulp_front_matter = require('gulp-front-matter');
var inPlace = require('metalsmith-in-place');
var layouts = require('metalsmith-layouts');


var metadata          = require('metalsmith-metadata');
var markdown          = require('metalsmith-markdown');
var marked            = require('marked'); //the markdown processor metalsmith-markdown uses


var permalinks        = require('metalsmith-permalinks');
var collections       = require('metalsmith-collections');
// var drafts            = require('metalsmith-drafts');
var tags              = require('metalsmith-tags');
var nunjucks = require('nunjucks');





module.exports = function(opts){

  opts.gulp.task('templates', function(){
    var labPath = './lab/' + opts.config.labpath;
    var distPath = './dist/' + opts.config.labpath;

    //configure templating engine you'll use with defaults
    //and filters
    var nunjucksEnv = nunjucks
      .configure(
        labPath + '/_layouts',
        {
        watch: false,
        autoescape: false, //prevent metalsmith-markdown results being escaped
        noCache: true
      });

    //nunjucks plugins
    var nunjucksDate = require('nunjucks-date');
    nunjucksDate.setDefaultFormat('MMMM Do, YYYY');
    nunjucksEnv.addFilter('date', nunjucksDate);


    return opts.gulp.src([ labPath + '/**/*.md', labPath + '/data/**/*.yaml'])
      .pipe(gulp_front_matter({
        property: 'frontMatter',
        remove: true
      }))
      .on("data", function(file) {
        _.assign(file, file.frontMatter);
        delete file.frontMatter;
      })
      .pipe(
        gulpsmith()
        // .metadata({ }) //global meta data
        // .use(drafts())
        // .use(metadata({ //various data
        //   site_global: 'site_global.yaml',
        //   page_home: 'page-home.yaml'
        //   // testJson: 'test.json'
        // }))
        .use(collections({
          posts: {
            pattern: 'posts/*.md',
            sortBy: 'date',
            reverse: true
          }
        }))
        .use(markdown({ //pass 'marked'  processor options here
          renderer: new marked.Renderer(),
          gfm: true,
          tables: true,
          breaks: false,
          pedantic: false,
          sanitize: false,
          smartLists: true,
          smartypants: false
        })) //translate any markdown not in raw to html
        .use(permalinks({
          pattern: 'posts/:title'
        }))
        .use(tags({
          handle: 'tags', //frontmatter key
          path:'tag/:tag.html', //aggresgate pages
          layout: 'tag.nunj',
          sortBy: 'date',
          reverse: true,
          skipMetadata: false,
          // Any options you want to pass to the [slug](https://github.com/dodo/node-slug) package.
          // slug: {mode: 'rfc3986'}

        }))
        .use(inPlace({ //apply nunjucks for variable interpolation
          engine: 'nunjucks',
          directory: labPath + '/_layouts'
        }))
        .use(layouts({ //apply nunjucks directives (extends, include, ...)
          engine: 'nunjucks',
          directory: labPath + '/_layouts'
        }))
      )
      .pipe(opts.gulp.dest( distPath ));

  });

}; //module.exports
