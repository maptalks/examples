var path = require('path');
var i18next = require('i18next');
var Backend = require('i18next-sync-fs-backend');

function i18n(options) {
  options = Object.assign({
    locales: [],
    fallbackLng: false,
    loadPath: './locales/{{lng}}/{{ns}}.json'
  }, options || {});

  i18next
    .use(Backend)
    .init({
      initImmediate: false,
      lng: options.locales[0],
      fallbackLng: options.fallbackLng,
      preload: options.locales,
      backend: {
        loadPath: options.loadPath
      }
    });

  function helper(locale) {
    function t(key) {
      var params = {
        lng: locale()
      };
      return i18next.t(key, params);
    }
    return { t: t };
  }

  return function (files, metalsmith, done) {
    Object.keys(files).forEach(function (file) {
      options.locales.forEach(function (locale) {
        var data = Object.assign({}, files[file]);
        var p = path.join(locale, file);
        var h = helper(function () { return locale; });
        data.locale = locale;
        data.t = h.t;
        data.i18nOrigPath = file;
        files[p] = data;
      });
      delete files[file];
    });
    done();
  };
}

module.exports = i18n;
