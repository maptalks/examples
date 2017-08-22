/* eslint global-require: 0 */
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect');
var ghPages = require('gulp-gh-pages');
var Metalsmith = require('metalsmith');
var branch = require('metalsmith-branch');
var layouts = require('metalsmith-layouts');
var assets = require('metalsmith-assets');
var debug = require('metalsmith-debug');
var multimatch = require('multimatch');
var marked = require('marked');
var helpers = require('./lib/helpers');
var i18n = require('./lib/plugins/i18n');

var markupRegex = /([^\/^\.]*)\.html$/;
var locales = ['en', 'cn'];

var siteInfo = {
  baseurl: '/examples'
};

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

function raw() {
  function isHtml(file) {
    return !!multimatch(file, '**/*.html')[0];
  }

  function isReadme(file) {
    return !!multimatch(file, '**/readme*.md')[0];
  }

  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      if (!isHtml(file)) return;
      // attach index.js/index.css to index.html
      processSingleFile(file, files);
    });

    Object.keys(files).forEach(function (file) {
      // do not copy/move readme
      if (isReadme(file)) return;

      // copy index.html, move other resources, to 'raw'
      var data = Object.assign({}, files[file]);
      data.raw = true;

      var dirname = path.dirname(file);
      var basename = path.basename(file);
      var rawPath = path.join(dirname, 'raw', basename);
      files[rawPath] = data;

      if (!isHtml(file)) {
        delete files[file];
      }

      // attach readme to html
      if (isHtml(file)) {
        data = files[file];
        dirname = path.dirname(data.i18nOrigPath);
        var langPart;
        if (data.locale === 'en') {
          langPart = '';
        } else {
          langPart = '-' + data.locale;
        }
        var md = path.join(dirname, 'readme' + langPart + '.md');
        if (md in files) {
          var contents = files[md].contents.toString();
          data.readme = {
            contents: marked(contents)
          };
          delete files[md];
        }
      }
    });

    done();
  };
}

gulp.task('build', function (done) {
  function isRaw(file, data) {
    return data.raw;
  }
  function notRaw(file, data) {
    return !data.raw;
  }
  Metalsmith(__dirname)
    .source('src')
    .destination('dist')
    .clean(true)
    .metadata({
      site: siteInfo
    })
    .use(i18n({
      ignore: '**/readme*.md',
      locales: locales
    }))
    .use(raw())
    .use(branch(isRaw)
          .use(layouts({
            engine: 'handlebars',
            pattern: '**/*.html',
            default: 'example.hbs',
            directory: 'layouts/raw',
            helpers: {
              indent: helpers.indent
            }
          })))
    .use(branch(notRaw)
          .use(layouts({
            engine: 'handlebars',
            pattern: '**/*.html',
            default: 'example.hbs',
            directory: 'layouts',
            partials: 'layouts/raw',
            helpers: {
              lunrIndex: helpers.lunrIndex,
              indent: helpers.indent,
              escape: helpers.escape
            }
          })))
    .use(assets({
      source: 'assets'
    }))
    .use(debug())
    .build(function (err, files) {
      if (err) {
        done(err);
        return;
      }
      connect.changed(Object.keys(files));
      done();
    });
});

gulp.task('watch', ['build'], function () {
  gulp.watch(['src/**/*', 'assets/**/*', 'layouts/**/*'], ['build']);
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    base: '/examples',
    root: 'dist',
    livereload: true,
    port: 20001
  });
});

gulp.task('deploy', ['build'], function () {
  return gulp.src('dist/**/*')
    .pipe(ghPages({
      message: 'Deploy to GitHub pages [ci skip]'
    }));
});

gulp.task('default', ['connect']);
