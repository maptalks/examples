/* eslint-env phantomjs */
/* eslint no-extend-native: 0, space-before-function-paren: 0 */

var fs = require('fs');
var webpage = require('webpage');
var args = require('system').args;

if (args.length !== 2) {
  phantom.exit(2);
}

var demoRootPath = args[1];

if (!String.prototype.endsWith) {
  String.prototype.endsWith = function(searchString, position) {
    var subjectString = this.toString();
    if (typeof position !== 'number' || !isFinite(position) || Math.floor(position) !== position || position > subjectString.length) {
      position = subjectString.length;
    }
    position -= searchString.length;
    var lastIndex = subjectString.indexOf(searchString, position);
    return lastIndex !== -1 && lastIndex === position;
  };
}

function listFiles(dir, files) {
  var entries = fs.list(dir);
  entries.forEach(function(entry) {
    if (entry === '.' || entry === '..') {
      return;
    }
    var path = [dir, entry].join('/');
    if (fs.isDirectory(path)) {
      listFiles(path, files);
    } else {
      files.push(path);
    }
  });
}

function list(dir) {
  var files = [];
  listFiles(dir, files);
  return files;
}

function asyncEach(iterableList, callback, done) {
  var i = -1, length = iterableList.length;

  function loop() {
    i++;
    if (i === length) {
      done();
      return;
    }
    callback(iterableList[i], loop);
  }
  loop();
}

function report(file, errorString) {
  if (errorString) {
    console.log('  FAILED: ' + file);
    console.log('  ' + errorString);
  } else {
    console.log('  SUCCESS: ' + file);
  }
}

function exit() {
  phantom.exit();
}

function check(file, next) {
  var page = webpage.create();

  page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function + '")' : ''));
      });
    }

    report(file, msgStack.join('\n'));

    next();
  };

  page.open(file, function(status) {
    if (status !== 'success') {
      report(file, status);
    } else {
      report(file);
    }

    next();
  });

}

if (!fs.exists(demoRootPath)) {
  var path = fs.absolute(demoRootPath);
  console.log('demoRootPath: "' + path + '" not exists.');
  exit();
}

var files = list(demoRootPath).filter(function(file) {
  return file.endsWith('.html');
});

asyncEach(files, check, exit);
