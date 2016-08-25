
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([121.485428, 31.228541], {
  symbol : [
    {
      'markerType' : 'ellipse',
      'markerWidth'  : {stops: [[1, 5], [18, 200]]},
      'markerHeight' : {stops: [[1, 5], [18, 200]]},
      'markerFill'  : '#18987f',
      'markerFillOpacity'  : 0.6,
      'markerLineColor' : '#34495e',
      'markerLineWidth' : 5
    },
    {
      'textFaceName' : '"microsoft yahei",arial,sans-serif',
      'textName' : 'Map\nTalks',
      'textFill' : '#fff',
      'textWrapCharacter' : '\n',
      'textSize'  : {stops: [[1, 2], [18, 50]]}
    }
  ]
}).addTo(layer);

new maptalks.control.Toolbar({
  items: [
    {
      item: 'Zoom in/out to change size',
      click: function () {
      }
    }
  ]
}).addTo(map);
