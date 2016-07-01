
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var labelNoBox = new maptalks.Label('label without box', [121.472345, 31.226732], {
  box: false
}).addTo(layer);
labelNoBox.setSymbol({
  textFill: 'cyan',
  textSize: 24
});

var labelWithBox = new maptalks.Label('label with box', [121.489545, 31.226732], {
  box: true,
  symbol: {
    markerLineColor: 'Gold',
    textFill: 'green',
    textSize: 24
  }
}).addTo(layer);
