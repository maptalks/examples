/* eslint global-require: 0 */
var path = require('path');
var gulp = require('gulp');
var del = require('del');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var Metalsmith = require('metalsmith');
var layouts = require('metalsmith-layouts');
var copy = require('metalsmith-copy');
var debug = require('metalsmith-debug');
var handlebars = require('handlebars');
var multimatch = require('multimatch');
var i18n = require('./i18n');

var markupRegex = /([^\/^\.]*)\.html$/;
var locales = ['en', 'cn'];

var mapParams = {
  'cn': {
    // 'urlTemplate' : 'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    // 'subdomains': '[1, 2, 3, 4]'
    'urlTemplate': 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    'subdomains': '["a","b","c","d","e"]',
    'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  },
  'en': {
    // 'urlTemplate': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // 'subdomains': '["a","b","c"]'
    'urlTemplate': 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
    'subdomains': '["a","b","c","d","e"]',
    'attribution': '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attributions">CARTO</a>'
  }
};

function readExamplesInfo() {
  var json = require('./build/examples.json');
  function buildLocalizedInfo(locale) {
    var items = json.examples;
    var count = items.length;
    var examples = [];
    var metadata = {};
    var i, j;
    for (i = 0; i < count; i++) {
      var category = items[i].title[locale];
      var subItems = items[i].examples;
      var subCount = subItems.length;
      var subExamples = [];
      for (j = 0; j < subCount; j++) {
        var title = subItems[j].title[locale];
        var key = path.join(items[i].name, subItems[j].name);
        metadata[key] = {
          category: category,
          title: title
        };
        subExamples.push({
          index: j + 1,
          name: subItems[j].name,
          title: title
        });
      }
      examples.push({
        index: i + 1,
        name: items[i].name,
        category: category,
        examples: subExamples
      });
    }
    return {
      examples: examples,
      metadata: metadata
    };
  }
  return locales.reduce(function (memo, locale) {
    memo[locale] = buildLocalizedInfo(locale);
    return memo;
  }, {});
}

var examplesInfo = readExamplesInfo();

function processSingleFile(file, files) {
  var basename = path.basename(file);
  var match = basename.match(markupRegex);
  if (!match) return;

  var data = files[file];

  var id = match[1];
  var dirnameOrig = path.dirname(data.i18nOrigPath);
  var dirname = path.dirname(file);

  var info = examplesInfo[data.locale];
  var meta = info.metadata;
  var filemeta = meta[dirnameOrig] || {};
  data.examples = info.examples;
  data.category = filemeta.category;
  data.title = filemeta.title;
  data.basename = basename;
  data.path = dirnameOrig;

  var js = path.join(dirname, id + '.js');
  if (js in files) {
    var params = mapParams[data.locale];
    data.js = {
      basename: id + '.js',
      source: files[js].contents.toString()
        .replace(/\$\(urlTemplate\)/g, params.urlTemplate)
        .replace(/\$\(subdomains\)/g, params.subdomains)
        .replace(/\$\(attribution\)/g, params.attribution)
    };
    delete files[js];
  }

  var css = path.join(dirname, id + '.css');
  if (css in files) {
    data.css = {
      basename: id + '.css',
      source: files[css].contents.toString()
    };
    delete files[css];
  }
}

function processExamples(options) {
  options = Object.assign({
    pattern: '**/*'
  }, options || {});

  var pattern = options.pattern;

  function isHtml(file) {
    return !!multimatch(file, '**/*.html')[0];
  }

  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      if (!multimatch(file, pattern)[0]) {
        delete files[file];
        return;
      }

      if (!isHtml(file)) return;

      processSingleFile(file, files);
    });

    done();
  };
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

function escapeHelper(options) {
  return handlebars.Utils.escapeExpression(options.fn(this));
}

gulp.task('build:raw', function (done) {
  Metalsmith(__dirname)
    .source('src')
    .destination('dist')
    .clean(false)
    .use(i18n({
      locales: locales
    }))
    .use(processExamples({
      pattern: '**/*'
    }))
    .use(layouts({
      engine: 'handlebars',
      pattern: '**/*.html',
      default: 'example.hbs',
      directory: 'layouts/raw',
      helpers: {
        indent: indentHelper
      }
    }))
    .use(copy({
      pattern: '**/*',
      move: true,
      transform: function (file) {
        var dirname = path.dirname(file);
        var basename = path.basename(file);
        return path.join(dirname, 'raw', basename);
      }
    }))
    .use(debug())
    .build(done);
});

gulp.task('build:demo', function (done) {
  Metalsmith(__dirname)
    .source('src')
    .destination('dist')
    .clean(false)
    .use(i18n({
      locales: locales
    }))
    .use(processExamples({
      pattern: ['**/*.html', '**/*.js', '**/*.css']
    }))
    .use(layouts({
      engine: 'handlebars',
      pattern: '**/*.html',
      default: 'example.hbs',
      directory: 'layouts',
      partials: 'layouts/raw',
      helpers: {
        indent: indentHelper,
        escape: escapeHelper
      }
    }))
    .use(debug())
    .build(done);
});

gulp.task('build', ['build:raw', 'build:demo'], function () {
  return gulp.src('assets/**/*')
    .pipe(gulp.dest('dist'))
    .pipe(connect.reload());
});

gulp.task('clean', function () {
  return del(['dist/**']);
});

gulp.task('watch', ['build'], function () {
  gulp.watch(['src/**/*', 'assets/**/*', 'layouts/**/*'], ['build']);
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    root: 'dist',
    livereload: true,
    port: 20001
  });
});

gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages());
});

gulp.task('default', ['connect']);
