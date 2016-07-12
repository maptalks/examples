
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
    symbol : {
      'textFaceName' : '"microsoft yahei",arial,sans-serif',
      'textName' : 'MapTalks is shown',
      'textFill' : '#34495e',
      'textHorizontalAlignment' : 'right',
      'textSize' : 40
    }
  }
);
var polyline = new maptalks.LineString([
  [121.467906, 31.233055], [121.4993941, 31.233055]
], {
  symbol: {
    lineColor: '#1bbc9b',
    lineWidth: 3
  }
});
var polygon = new maptalks.Polygon([
  [121.467906, 31.23217],
  [121.499394, 31.23217],
  [121.499394, 31.227255],
  [121.467906, 31.227255],
  [121.467906, 31.23217]
], {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: 'rgb(135,196,240)',
    polygonOpacity: 0.6
  }
});

var layer = new maptalks.VectorLayer('vector')
    .addGeometry([marker, polyline, polygon])
    .addTo(map);

function show() {
  marker.show();
  polyline.show();
  polygon.show();
}

function hide() {
  marker.hide();
  polyline.hide();
  polygon.hide();
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Show',
      click: function () {
        show();
      }
    },
    {
      item: 'Hide',
      click: function () {
        hide();
      }
    }
  ]
}).addTo(map);
