(function () {
  /* global toggleClass */
  'use strict';

  var menuBtn = document.getElementsByClassName('menu-button')[0];
  menuBtn.addEventListener('click', function () {
    var sidebar = document.getElementsByClassName('sidebar')[0];
    toggleClass(sidebar, '-active');
  });
}());
