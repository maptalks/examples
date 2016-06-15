var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');

function processRaw (files, metalsmith, done) {
  setImmediate(done);
  var order = 1;
  // TODO: get order from examples.json
  for (var filename in files) {
    var file = files[filename];
    file.order = order;
    order++;
  }
}

function processDemo (files, metalsmith, done) {
  setImmediate(done);
  var order = 1;
  for (var filename in files) {
    var file = files[filename];
    file.basename = path.basename(filename);
  }
}

gulp.task('examples-raw', function () {
  return gulp.src('examples/**/*.{html,js,css}')
    .pipe(metalsmith({
      use: [
        drafts(),
        processRaw,
        layouts({engine: 'handlebars', directory: 'layouts/raw'})
      ]
    }))
    .pipe(rename(function (path) {
      path.dirname += '/raw';
      return path;
    }))
    .pipe(gulp.dest('dist/examples'));
});

gulp.task('examples-demo', function () {
  return gulp.src('examples/**/*.{html,js,css}')
    .pipe(metalsmith({
      use: [
        drafts(),
        processDemo,
        layouts({engine: 'handlebars', directory: 'layouts'})
      ]
    }))
    .pipe(gulp.dest('dist/examples'));
});

gulp.task('examples', ['examples-raw', 'examples-demo']);

gulp.task('default', ['examples']);
