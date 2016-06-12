var fs = require('fs');
var webpage = require('webpage');

var demoRootPath = 'demos';

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

function report(file, errorString) {
  if (errorString) {
    console.log('\tFAILED: ' + file);
    console.log('\t' + errorString);
  } else {
    console.log('\tSUCCESS: ' + file);
  }
}

function atexit() {
  phantom.exit();
}

function check(file, idx, total) {
  var page = webpage.create();

  page.onError = function(msg, trace) {
    var msgStack = ['ERROR: ' + msg];

    if (trace && trace.length) {
      msgStack.push('TRACE:');
      trace.forEach(function(t) {
        msgStack.push(' -> ' + t.file + ': ' + t.line + (t.function ? ' (in function "' + t.function +'")' : ''));
      });
    }

    report(file, msgStack.join('\n'));
  };

  page.open(file, function(status) {
    if (status !== 'success') {
      report(file, status);
    } else {
      report(file);
    }
    if (idx === total - 1) {
      atexit();
    }
  });
}

if (!fs.exists(demoRootPath)) {
  var path = fs.absolute(demoRootPath);
  console.log('demoRootPath: "' + path + '" not exists.');
  atexit();
}

var files = list(demoRootPath);
files.forEach(function(file, idx) {
  if (!file.endsWith('.html')) return;
  check(file, idx, files.length - 1);
});
