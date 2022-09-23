
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 10,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var line = new maptalks.LineString(
  [
    map.getCenter().sub(0.1, 0),
    map.getCenter().add(0.1, 0),
    map.getCenter().add(0.1, -0.1)
  ],
  {
    symbol:{
      'lineColor' : '#1bbc9b',
      'lineWidth' : 6,
      'lineJoin'  : 'round', //miter, round, bevel
      'lineCap'   : 'round', //butt, round, square
      'lineDasharray' : null,//dasharray, e.g. [10, 5, 5]
      'lineOpacity ' : 1
    }
  }
).addTo(layer);
