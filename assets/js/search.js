/* global lunr */
var classlist = require('./classlist');

var elements = document.getElementsByClassName('example');
var $input = document.getElementById('example-search-input');
var $button = document.getElementById('example-search-button');
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

function buildSearchHandler(doSearch) {
  function searchHandler() {
    var value = $input.value;

    if (!value) {
      displayAll();
      return;
    }

    if (doSearch) {
      search(value);
    }
  }
  return searchHandler;
}

$input.addEventListener('input', buildSearchHandler(false));
$input.addEventListener('keyup', function (event) {
  if (event.keyCode === 13) {
    buildSearchHandler(true)();
  }
});

$button.addEventListener('click', buildSearchHandler(true));
