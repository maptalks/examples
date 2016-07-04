var path = require('path');
var fs = require('fs');
var all = require('../examples/examples.json');
var chalk = require('chalk');

module.exports = exports = {
  check: function () {
    var examples = all.examples,
      len = examples.length,
      cat = null;
    examples.forEach(function (ele, index) {
        var cat = ele.name;
        console.log(' ' + chalk.green(ele.name));
        var demos = ele.examples;
        for (var i = 0; i < demos.length; i++) {
          if (this._check(cat, demos[i].name)) {
            console.log('\t' + chalk.green('√ '+demos[i].name));
          } else {
            console.log('\t' + chalk.red('× '+demos[i].name));
          }
        }
    }, this);
  },

  listHelper: function (i, options) {
    var items = all.examples;
    var out = '';
    for (var i = 0; i < items.length; i++) {
      var cat = items[i];
      out += '<h3>' + (i + 1 ) + ' ' + cat.title.zh + '</h3>';
      out += "<ul>";
      var examples = cat.examples;
      for(var ii=0, ll=examples.length; ii<ll; ii++) {
        out += '<li><a target="_blank" href = "' + cat.name + '/' + examples[ii].name + '/index.html">' + (i + 1 ) + '.' + (ii + 1 ) + ' '  + examples[ii].title.zh + '</a></li>';
      }
      out += '</ul>'

    }

    return out;
  },

  snaps: function (dir) {
  },

  _check: function (cat, name) {
    var demoRoot = path.join(__dirname, '..', 'examples'),
      demoPath = path.join(demoRoot, cat, name),
      html = path.join(demoPath, 'index.html'),
      js = path.join(demoPath, 'index.js');
    try {
      fs.accessSync(html);
      return true;
    } catch (err) {
    }
    try {
      fs.accessSync(js);
      return true;
    } catch (err) {
    }
    return false;
  },

  _snap: function (name) {

  }
}
