var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');

var markupRegex = /([^\/^\.]*)\.html$/;

function readExamplesInfo () {
  var json = require('./examples/examples.json');
  var items = json.examples[0];
  var count = Math.floor(items.length/3);
  var info = {};
  var i, j, order = 0;
  for (i = 0; i < count; i++) {
    var ibase = i*3;
    var subItems = items[ibase+2];
    var subCount = Math.floor(subItems.length/2);
    for (j = 0; j < subCount; j++) {
      order++;
      var jbase = j*2;
      var key = path.join(items[ibase], subItems[jbase]);
      info[key] = {
        'category': items[ibase+1],
        'title': subItems[jbase+1],
        'order': order
      };
    }
  }
  return info;
}

function processSingleFile (file, filepath, files) {
  var basename = path.basename(filepath);
  var match = basename.match(markupRegex);
  if (!match) return;

  var id = match[1];
  var dirname = path.dirname(filepath);

  var info = readExamplesInfo();
  file.meta = info[dirname];

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
