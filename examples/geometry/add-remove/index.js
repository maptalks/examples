
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
      'textName' : 'MapTalks',
      'textFill' : '#34495e',
      'textHorizontalAlignment' : 'right',
      'textSize' : 40
    }
  }
);
var polyline = new maptalks.LineString([
  [121.467906, 31.233055], [121.4913941, 31.233055]
], {
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  }
});
var polygon = new maptalks.Polygon([
  [121.467906, 31.23217],
  [121.491394, 31.23217],
  [121.491394, 31.227255],
  [121.467906, 31.227255],
  [121.467906, 31.23217]
], {
  symbol: {
    'lineColor' : '#34495e',
    'lineWidth' : 2,
    'polygonFill' : 'rgb(135,196,240)',
    'polygonOpacity' : 0.6
  }
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

function add() {
  marker.addTo(layer);
  polyline.addTo(layer);
  polygon.addTo(layer);
}

function remove() {
  marker.remove();
  polyline.remove();
  polygon.remove();
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Add',
      click: function () {
        add();
      }
    },
    {
      item: 'Remove',
      click: function () {
        remove();
      }
    }
  ]
}).addTo(map);

add();
