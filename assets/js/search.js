/* global lunr */
var classlist = require('./classlist');

var elements = document.getElementsByClassName('example');
var $input = document.getElementById('example-search-input');
var elementLen = elements.length;
var index = lunr.Index.load(window.SEARCH_INDEX);

function search(value) {
  var result = index.search(value);
  var len = result.length;
  var selected = {};
  var i = 0;

  for (i = 0; i < len; i++) {
    selected[result[i].ref] = true;
  }

  for (i = 0; i < elementLen; i++) {
    if (selected[i]) {
      classlist.addClass(elements[i], 'on');
    } else {
      classlist.removeClass(elements[i], 'on');
    }
  }
}

function displayAll() {
  for (var i = 0; i < elementLen; i++) {
    classlist.addClass(elements[i], 'on');
  }
}

$input.addEventListener('input', function () {
  var value = this.value;

  if (!value) {
    displayAll();
    return;
  }

  search(value);
});
