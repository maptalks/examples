/* eslint global-require: 0 */
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var rename = require('gulp-rename');
var metalsmith = require('gulp-metalsmith');
var layouts = require('metalsmith-layouts');
var drafts = require('metalsmith-drafts');
var define = require('metalsmith-define');
var connect = require('gulp-connect');
var builder = require('./build/build');

var handlebars = require('handlebars');

var markupRegex = /([^\/^\.]*)\.html$/;
var locale = process.env.locale || 'cn';

var defines = define({
  'urls': {
    'cn': {
      // 'urlTemplate' : 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
      // 'subdomains': '[1, 2, 3, 4]'
      'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
      'subdomains'  : "['a','b','c','d','e']"
    },
    'en': {
      // 'urlTemplate': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      // 'subdomains': '["a","b","c"]'
      'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
      'subdomains'  : "['a','b','c','d','e']"
    }
  }
});

function readExamplesInfo() {
  var json = require('./build/examples.json');
  var items = json.examples;
  var count = Math.floor(items.length);
  var info = {};
  var i, j, order = 0;
  for (i = 0; i < count; i++) {
    var subItems = items[i].examples;
    var subCount = subItems.length;
    for (j = 0; j < subCount; j++) {
      order++;
      var key = path.join(items[i].name, subItems[j].name);
      info[key] = {
        'category': items[i].title,
        'title': subItems[j].title,
        'order': order
      };
    }
  }
  return info;
}

function processSingleFile(file, filepath, files, metadata, isRaw) {
  var basename = path.basename(filepath);
  var match = basename.match(markupRegex);
  if (!match) return;

  var id = match[1];
  var dirname = path.dirname(filepath);

  var info = readExamplesInfo();
  file.meta = info[dirname] || {};
  if (file.meta.category) {
    file.category = file.meta.category[locale];
  }
  if (file.meta.title) {
    file.title = file.meta.title[locale];
  }
  file.basename = basename;
  file.path = dirname;
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
    if (!isRaw) {
      delete files[css];
    }
  }
}

/**
 * Process the raw demo pages
 */
function processRaw(files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    processSingleFile(file, filepath, files, metalsmith.metadata(), true);
  }
}

/**
 * Process demo pages
 */
function processDemo(files, metalsmith, done) {
  setImmediate(done);
  for (var filepath in files) {
    var file = files[filepath];
    processSingleFile(file, filepath, files, metalsmith.metadata(), false);
  }
}

/**
 *
 */
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

function escapeHelper(options) {
  return handlebars.Utils.escapeExpression(options.fn(this));
}

var outputFolder = '../examples.maptalks.org';

gulp.task('examples-raw', function () {
  return gulp.src('src/examples/**/*')
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
          }
        })
      ]
    }))
    .pipe(rename(function (path) {
      path.dirname += '/raw';
      return path;
    }))
    .pipe(gulp.dest(path.join(outputFolder, locale, 'examples')));
});

var options = [
  drafts(),
  defines,
  processDemo,
  layouts({
    engine: 'handlebars',
    directory: 'layouts',
    partials: 'layouts/raw',
    helpers: {
      indent: indentHelper,
      escape: escapeHelper,
      list: builder.listHelper
    }
  })
];

gulp.task('examples-demo', function () {
  return gulp.src('src/examples/**/*.{html,js,css}')
    .pipe(metalsmith({
      use: options
    }))
    .pipe(gulp.dest(path.join(outputFolder, locale, 'examples')));
});

gulp.task('examples-index', function () {
  return gulp.src('src/*.{html,js,css}')
    .pipe(metalsmith({
      use: options
    }))
    .pipe(gulp.dest(path.join(outputFolder, locale)));
});

gulp.task('examples', ['examples-index', 'examples-raw', 'examples-demo'], function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest(outputFolder));
});

gulp.task('clean', function () {
  return del([
    'dist/**/*'
  ]);
});

gulp.task('watch', ['examples'], function () {
  gulp.watch(['./src/**/*', './assets/**/*', './layouts/**/*'], ['examples']);
  gulp.watch(['./build/*'], ['examples-index']);
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    root: outputFolder,
    livereload: true,
    port: 20001
  });
});

gulp.task('check', function () {
  builder.check();
});

gulp.task('default', ['connect']);
