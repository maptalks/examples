
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker([121.487542, 31.225812]);
var polyline = new maptalks.Polyline([
  [121.471234, 31.211879], [121.493355, 31.221321]
], {
  symbol: {
    lineColor: 'orange',
    lineWidth: 2
  }
});
var polygon = new maptalks.Polygon([
  [121.468765, 31.243709],
  [121.483355, 31.242659],
  [121.483355, 31.223344],
  [121.478332, 31.220102],
  [121.468321, 31.234567]
], {
  symbol: {
    lineColor: 'ForestGreen',
    lineWidth: 2,
    polygonFill: '#abc',
    polygonOpacity: 0.7
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
