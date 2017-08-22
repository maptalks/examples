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
