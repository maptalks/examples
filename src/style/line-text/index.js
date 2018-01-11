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
    map.getCenter().add(0.1, -0.1),
    map.getCenter().sub(0.1, 0.1),
    map.getCenter().sub(0.1, 0)
  ],
  {
    symbol:{
      'lineColor' : '#1bbc9b',
      'lineWidth' : 8,
      'textName'  : 'line',
      'textPlacement' : 'line',
      'textSize'  : 20,
      'textDy' : -20
    }
  }
).addTo(layer);
