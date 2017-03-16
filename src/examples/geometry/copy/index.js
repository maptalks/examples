
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});


var layer = new maptalks.VectorLayer('vector').addTo(map);
var copyLayer = new maptalks.VectorLayer('copy').addTo(map);

var counter = 1;

var rect = new maptalks.Rectangle(
  [-0.113049,51.49656],
  800, 600,
  {
    'symbol': {
      'lineColor': '#fff',
      'lineWidth': 2,
      'polygonFill': 'rgb(216,115,149)',
      'polygonOpacity': 0.7
    }
  }).addTo(layer);

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Copy',
      click: function () {
        var copy = rect.copy();
        copy.translate([0.003 * counter, -0.003 * (counter++)]);
        copy.addTo(copyLayer);
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
