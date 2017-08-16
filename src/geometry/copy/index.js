var c = new maptalks.Coordinate(-0.113049,51.49856);
var map = new maptalks.Map('map', {
  center: c,
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
//<<<<<<<< prepare data
var layer = new maptalks.VectorLayer('vector').addTo(map);
var copyLayer = new maptalks.VectorLayer('copy').addTo(map);

var rect = new maptalks.Rectangle(
  c.add(-0.008, 0.008),
  800, 600,
  {
    'symbol': {
      'lineColor': '#fff',
      'lineWidth': 2,
      'polygonFill': 'rgb(216,115,149)',
      'polygonOpacity': 0.7
    }
  }).addTo(layer);
//>>>>>>>>

var counter = 1;
var toolBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Copy',
      click: function () {
        rect.copy()
          .translate([0.003 * counter, -0.003 * (counter++)])
          .addTo(copyLayer);
      }
    },
    {
      item: 'Clear',
      click: function () {
        counter = 1;
        copyLayer.clear();
      }
    }
  ]
}).addTo(map);
