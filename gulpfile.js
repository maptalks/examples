/* eslint global-require: 0 */
var path = require('path');
var gulp = require('gulp');
var connect = require('gulp-connect-ex');
var ghPages = require('gulp-gh-pages');
var Metalsmith = require('metalsmith');
var branch = require('metalsmith-branch');
var layouts = require('metalsmith-layouts');
var assets = require('metalsmith-assets-ex');
var webpack = require('ms-webpack');
var debug = require('metalsmith-debug');
var multimatch = require('multimatch');
var marked = require('marked');
var CleanCSS = require('clean-css');
var helpers = require('./lib/helpers');
var i18n = require('./lib/plugins/i18n');

var markupRegex = /([^\/^\.]*)\.html$/;
var locales = ['en', 'cn'];

var siteInfo = {
  baseurl: '/examples'
};

var mapParams = {
  'cn': {
    // 'urlTemplate' : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // 'subdomains'  : '[\'a\',\'b\',\'c\']',
    // 'attribution': '&copy; <a href="http://www.osm.org" target="_blank">OpenStreetMap</a> contributors'
    // 'urlTemplate' : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    'urlTemplate' : 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965',
    'subdomains': '[\'a\',\'b\',\'c\',\'d\']',
    'attribution': '&copy; Google Maps'
  },
  'en': {
    // 'urlTemplate': 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
    // 'urlTemplate' : 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    // 'subdomains'  : '[\'a\',\'b\',\'c\']',
    // 'attribution': '&copy; <a href="http://www.osm.org" target="_blank">OpenStreetMap</a> contributors'

    // 'urlTemplate' : 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/light_all/{z}/{x}/{y}.png',
    'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
    'subdomains': '[\'a\',\'b\',\'c\',\'d\']',
    'attribution': '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>'
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
          url: subItems[j].url,
          name: subItems[j].name,
          mark : subItems[j].mark || '',
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
    memo.isCN = (locale === 'cn');
    return memo;
  }, {});
}

var examplesInfo = readExamplesInfo();

var cleanCSS = new CleanCSS({
  level: 0,
  format: 'keep-breaks'
});

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
    var contents = files[css].contents.toString();
    var output = cleanCSS.minify(contents);
    data.css = {
      basename: id + '.css',
      source: output.styles
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
    .use(webpack(require('./webpack.config.js')))
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
      ignores: ['js', 'css'],
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
  gulp.watch(['src/**/*', 'assets/**/*', 'layouts/**/*', 'static/**/*'], ['build']);
});

gulp.task('connect', ['watch'], function () {
  connect.server({
    name : 'maptalks examples',
    base : '/examples',
    root: './dist',
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
