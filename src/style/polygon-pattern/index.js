
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 13,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
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
