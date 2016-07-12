
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker(
  [121.467906,31.2351467],
  {
    'draggable' : true,
    'symbol' : {
      'textFaceName' : '"microsoft yahei",arial,sans-serif',
      'textName' : 'Try to Drag Us',
      'textFill' : '#34495e',
      'textHorizontalAlignment' : 'right',
      'textSize' : 40
    }
  }
);
var polyline = new maptalks.LineString([
  [121.467906, 31.233055], [121.4993941, 31.233055]
], {
  'draggable' : true,
  'symbol': {
    'lineColor': '#1bbc9b',
    'lineWidth': 5
  }
});
var polygon = new maptalks.Polygon([
  [121.467906, 31.23217],
  [121.499394, 31.23217],
  [121.499394, 31.227255],
  [121.467906, 31.227255],
  [121.467906, 31.23217]
], {
  'draggable' : true,
  'symbol': {
    'lineColor': '#34495e',
    'lineWidth': 2,
    'polygonFill': 'rgb(135,196,240)',
    'polygonOpacity': 0.6
  }
});

var geometries = [marker, polyline, polygon];

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(geometries)
    .addTo(map);
