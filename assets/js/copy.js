/* global Clipboard */
var tooltip = require('./tooltips');

var copyBtn = document.getElementById('action-link-copy');
copyBtn.addEventListener('mouseleave', tooltip.clearTooltip);
copyBtn.addEventListener('blur', tooltip.clearTooltip);

var clipboard = new Clipboard('#action-link-copy');
var copied = document.getElementById('text-message-copied');
var msg = copied ? copied.innerText : 'Copied';
clipboard.on('success', function (e) {
  e.clearSelection();
  tooltip.showTooltip(e.trigger, msg);
});
