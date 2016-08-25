
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var rect = new maptalks.Rectangle(
  map.getCenter().add(-0.03, 0.01), 4250, 3000,
  {
    symbol:{
      'lineColor' : '#fff',
      'polygonPatternFile' : 'fill-pattern.png',
      'polygonOpacity' : 1
    }
  }
).addTo(layer);
