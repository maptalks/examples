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
