
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var line = new maptalks.LineString(
  [
    map.getCenter().substract(0.1, 0),
    map.getCenter().add(0.1, 0)
  ],
  {
    symbol:{
      'linePatternFile' : 'line-pattern.png',
      'lineOpacity' : 1,
      'lineWidth' : 20
    }
  }
).addTo(layer);
