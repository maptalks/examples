var handlebars = require('handlebars');

exports.indent = function indentHelper(text, options) {
  if (!text) {
    return text;
  }
  var count = options.hash.spaces || 2;
  var spaces = new Array(count + 1).join(' ');
  return text.split('\n').map(function (line) {
    return line ? spaces + line : '';
  }).join('\n');
};

exports.escape = function escapeHelper(options) {
  return handlebars.Utils.escapeExpression(options.fn(this));
};
