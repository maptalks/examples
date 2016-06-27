
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var distanceTool = new maptalks.DistanceTool({
  symbol: {
    lineColor: 'yellow',
    lineWidth: 2
  },
  language: ''
}).addTo(map);
