/* eslint global-require: 0 */
var path = require('path');
var gulp = require('gulp');
var rename = require('gulp-rename');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');
var define = require('metalsmith-define');
var connect = require('gulp-connect');

var markupRegex = /([^\/^\.]*)\.html$/;
var locale = process.env.locale || 'en';

var defines = define({
  'urls': {
    'zh': {
      'urlTemplate' : 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      'subdomains': '[1, 2, 3, 4]'
    },
    'en': {
      'urlTemplate': 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',//http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}',
      'subdomains': "['a','b','c']"
      // 'subdomains': '[1, 2, 3, 4]'
    }
  }
});

function readExamplesInfo() {
  var json = require('./examples/examples.json');
  var items = json.examples[0];
  var count = Math.floor(items.length / 3);
  var info = {};
  var i, j, order = 0;
  for (i = 0; i < count; i++) {
    var ibase = i * 3;
    var subItems = items[ibase + 2];
    var subCount = Math.floor(subItems.length / 2);
    for (j = 0; j < subCount; j++) {
      order++;
      var jbase = j * 2;
      var key = path.join(items[ibase], subItems[jbase]);
      info[key] = {
        'category': items[ibase + 1],
        'title': subItems[jbase + 1],
        'order': order
      };
    }
  }
  return info;
}

function processSingleFile(file, filepath, files, metadata) {
  var basename = path.basename(filepath);
  var match = basename.match(markupRegex);
  if (!match) return;

  var id = match[1];
  var dirname = path.dirname(filepath);

  var info = readExamplesInfo();
  file.meta = info[dirname] || {};
  file.category = file.meta.category[locale];
  file.title = file.meta.title[locale];
  file.order = file.meta.order;

  var js = path.join(dirname, id + '.js');
  if (js in files) {
    var url = metadata['urls'][locale];
    file.js = {
      basename: id + '.js',
      source: files[js].contents.toString()
        .replace(/\$\(urlTemplate\)/g, url.urlTemplate)
        .replace(/\$\(subdomains\)/g, url.subdomains)
    };
    delete files[js];
  }

  var css = path.join(dirname, id + '.css');
  if (css in files) {
    file.css = {
      basename: id + '.css',
      source: files[css].contents.toString()
    };
    delete files[css];
  }
}

function processRaw(files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    processSingleFile(file, filepath, files, metalsmith.metadata());
  }
}

function processDemo(files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    var basename = path.basename(filepath);
    processSingleFile(file, filepath, files, metalsmith.metadata());
    file.basename = basename;
  }
}

function indentHelper(text, options) {
  if (!text) {
    return text;
  }
  var count = options.hash.spaces || 2;
  var spaces = new Array(count + 1).join(' ');
  return text.split('\n').map(function (line) {
    return line ? spaces + line : '';
  }).join('\n');
}

gulp.task('examples-raw', ['resource-copy'], function () {
  return gulp.src('examples/**/index.{html,js,css}')
    .pipe(metalsmith({
      use: [
        drafts(),
        defines,
        processRaw,
        layouts({
          engine: 'handlebars',
          directory: 'layouts/raw',
          helpers: {
            indent: indentHelper
          }})
      ]
    }))
    .pipe(rename(function (path) {
      path.dirname += '/raw';
      return path;
    }))
    .pipe(gulp.dest(path.join('dist/examples', locale)));
});

gulp.task('resource-copy', function () {
  return gulp.src('examples/**/!(index.js|index.css|index.html)')
    .pipe(rename(function (path) {
      path.dirname += '/raw';
      return path;
    }))
    .pipe(gulp.dest(path.join('dist/examples', locale)));
});

gulp.task('examples-demo', function () {
  return gulp.src('examples/**/*.{html,js,css}')
    .pipe(metalsmith({
      use: [
        drafts(),
        defines,
        processDemo,
        layouts({engine: 'handlebars', directory: 'layouts'})
      ]
    }))
    .pipe(gulp.dest(path.join('dist/examples', locale)));
});

gulp.task('examples', ['examples-raw', 'examples-demo'], function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('dist'));
});

gulp.task('watch', ['examples'], function () {
  var scriptWatcher = gulp.watch(['./examples/**/*', './assets/**/*', './layouts/**/*'], ['examples']); // watch the same files in our scripts task
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 20001
  });
});

gulp.task('default', ['connect']);
