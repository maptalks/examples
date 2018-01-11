var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var textPanel = new maptalks.control.Panel({
  'position'      : 'top-right',
  'draggable'     : true,
  'custom'        : false,
  'content'       : 'A draggable text panel.',
  'closeButton'   : true
});
map.addControl(textPanel);

var customPanel = new maptalks.control.Panel({
  'position'      : 'bottom-right',
  'draggable'     : true,
  'custom'        : true,
  'content'       : '<div class="content">' +
    'A custom panel.<br>' +
    '<input type="text" height=10 value="a text input"/><br>' +
    '<br><a href="javascript:;" onclick="hide()">close</a>' +
    '</div>'
});
map.addControl(customPanel);

function hide() {
  customPanel.hide();
}
