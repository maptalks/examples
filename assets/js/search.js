(function () {
  /* global lunr */
  'use strict';

  var elements = document.getElementsByClassName('example');
  var $input = document.getElementById('example-search-input');
  var elementLen = elements.length;
  var index = lunr.Index.load(window.SEARCH_INDEX);

  function addClass(elem, className) {
    var classList = elem.classList;

    if (!classList.contains(className)) {
      classList.add(className);
    }
  }

  function removeClass(elem, className) {
    var classList = elem.classList;

    if (classList.contains(className)) {
      classList.remove(className);
    }
  }

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
        addClass(elements[i], 'on');
      } else {
        removeClass(elements[i], 'on');
      }
    }
  }

  function displayAll() {
    for (var i = 0; i < elementLen; i++) {
      addClass(elements[i], 'on');
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
}());
