
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('v').addTo(map);

var label = new maptalks.Label('label with box', [-0.117, 51.496], {
  'box'          :   true,
  'boxAutoSize'  :   true,
  'boxMinWidth'  :   0,
  'boxMinHeight' :   0,
  'boxPadding'   :   { 'width' : 26, 'height' : 8 },
  'boxTextAlign' :   'middle', //left, middle, right
  'symbol': {
    'markerLineColor': '#34495e',
    'markerFill' : '#34495e',
    'textFaceName' : 'sans-serif',
    'textFill' : '#fff',
    'textSize' : 18
  }
}).addTo(layer);


var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Edit Text',
      click: function () {
        label.startEditText();
      }
    },
    {
      item: 'End Edit',
      click: function () {
        label.endEditText();
      }
    }
  ]
}).addTo(map);
