var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');

var markupRegex = /([^\/^\.]*)\.html$/;

var exampleInfo = require('./examples/examples.json');
var orderedKeys = [];
for (var i = 0; i < exampleInfo.examples.length; i++) {
  var dir = exampleInfo.examples[i][0];
  var subdirs = exampleInfo.examples[i][2];
  for (var j = 0; j < subdirs.length; j++) {
    var subdir = subdirs[j];
    orderedKeys.push(path.join(dir, subdir));
  }
}

function processSingleFile (file, filepath, files) {
  var basename = path.basename(filepath);
  var match = basename.match(markupRegex);
  if (!match) return;

  var id = match[1];
  var dirname = path.dirname(filepath);

  var js = path.join(dirname, id + '.js');
  if (js in files) {
    file.js = {
      source: files[js].contents.toString()
    };
  }

  var css = path.join(dirname, id + '.css');
  if (css in files) {
    file.css = {
      source: files[css].contents.toString()
    };
  }

  file.order = orderedKeys.indexOf(dirname);
}

function processRaw (files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    processSingleFile(file, filepath, files);
  }
}

function processDemo (files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    var basename = path.basename(filepath);
    processSingleFile(file, filepath, files);
    file.basename = basename;
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
