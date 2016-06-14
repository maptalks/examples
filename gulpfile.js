var path = require('path');
var gulp = require('gulp');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');

function addOrder (files, metalsmith, done) {
  setImmediate(done);
  var order = 1;
  for (var filename in files) {
    var file = files[filename];
    file.order = order;
    order++;
  }
}

function getGlobs () {
  var exampleMeta = require('./examples/examples.json');
  var examples = exampleMeta.examples;
  var globs = [];
  var i, j;
  for (i = 0; i < examples.length; i++) {
    var dir = examples[i][0];
    var subdirs = examples[i][2];
    for (j = 0; j < subdirs.length; j++) {
      var subdir = subdirs[j];
      globs.push(['examples', dir, subdir, '**/*.html'].join('/'));
    }
  }
  return globs;
}

gulp.task('examples', function () {
  return gulp.src(getGlobs(), {base: 'examples/'})
    .pipe(metalsmith({
      use: [
        drafts(),
        addOrder,
        layouts({engine: 'handlebars'})
      ]
    }))
    .pipe(gulp.dest('dist'));
});
