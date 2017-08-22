var classlist = require('./classlist');

var menuBtn = document.getElementsByClassName('menu-button')[0];
menuBtn.addEventListener('click', function () {
  var sidebar = document.getElementsByClassName('sidebar')[0];
  classlist.toggleClass(sidebar, '-active');
});
