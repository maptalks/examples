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

function toggleClass(elem, className) {
  var classList = elem.classList;

  if (!classList.contains(className)) {
    classList.add(className);
  } else {
    classList.remove(className);
  }
}

function clearTooltip(e) {
  e.currentTarget.setAttribute('class', 'action-link');
  e.currentTarget.removeAttribute('aria-label');
}

/* eslint no-unused-vars: 0 */
function showTooltip(elem, msg) {
  elem.setAttribute('class', 'action-link tooltipped tooltipped-s');
  elem.setAttribute('aria-label', msg);
}

var copyBtn = document.getElementById('action-link-copy');
copyBtn.addEventListener('mouseleave', clearTooltip);
copyBtn.addEventListener('blur', clearTooltip);

(function () {
  /* global toggleClass */
  'use strict';

  var elements = document.getElementsByClassName('lang-option');
  for (var i = 0; i < elements.length; i++) {
    var element = elements[i];
    element.addEventListener('click', function () {
      var switcher = document.getElementsByClassName('lang-switch')[0];
      toggleClass(switcher, '-en');
    });
  }
}());

(function () {
  /* global toggleClass */
  'use strict';

  var menuBtn = document.getElementsByClassName('menu-button')[0];
  menuBtn.addEventListener('click', function () {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    toggleClass(sidebar, '-active');
  });
}());
