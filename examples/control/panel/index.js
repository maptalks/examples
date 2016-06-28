
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var textPanel = new maptalks.control.Panel({
  'position'  : {'top': '10', 'right': '10'},
  'draggable'     : true,
  'custom'        : false,
  'content'       : 'This is a text panel.',
  'closeButton'   : true
});
map.addControl(textPanel);

var htmlPanel = new maptalks.control.Panel({
  'position'  : {'bottom': '10', 'right': '10'},
  'draggable'     : true,
  'custom'        : true,
  'content'       : '<div class="content"><div class="closeButton" onclick="closeHtmlPanel()">x</div>This is a html panel.</div>'
});
map.addControl(htmlPanel);

function closeHtmlPanel() {
  htmlPanel.hide();
}
