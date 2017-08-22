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

window.addClass = addClass;
window.removeClass = removeClass;
window.toggleClass = toggleClass;
