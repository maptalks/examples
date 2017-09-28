var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var copyLayer = new maptalks.VectorLayer('copy').addTo(map);

var rect = new maptalks.Rectangle(
  [-0.121049, 51.50656],
  800, 600,
  {
    'symbol': {
      'lineColor': '#fff',
      'lineWidth': 2,
      'polygonFill': 'rgb(216,115,149)',
      'polygonOpacity': 0.7
    }
  }).addTo(layer);

var counter = 1;
function copy() {
  // copy with translation of [0.003, -0.003]
  rect.copy()
  .translate(0.003 * counter, -0.003 * counter)
  .addTo(copyLayer);
  counter++;
}

function clear() {
  counter = 1;
  copyLayer.clear();
}
