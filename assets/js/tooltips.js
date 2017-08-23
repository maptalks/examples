exports.clearTooltip = function (e) {
  e.currentTarget.setAttribute('class', 'action-link');
  e.currentTarget.removeAttribute('aria-label');
};

exports.showTooltip = function (elem, msg) {
  elem.setAttribute('class', 'action-link tooltipped tooltipped-s');
  elem.setAttribute('aria-label', msg);
};
