var c = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: c,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker(c.add(-0.018,0.007));
var line = new maptalks.LineString([
  c.add(-0.018,0.005),
  c.add(0.006,0.005)
], {
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  }
});
var polygon = new maptalks.Polygon([
  c.add(-0.018,0.004),
  c.add(0.006,0.004),
  c.add(0.006,-0.001),
  c.add(-0.018,-0.001),
  c.add(-0.018,0.004)
], {
  symbol: {
    'lineColor' : '#34495e',
    'lineWidth' : 2,
    'polygonFill' : 'rgb(135,196,240)',
    'polygonOpacity' : 0.6
  }
});

var collection = new maptalks.GeometryCollection([marker, line, polygon]);

var layer = new maptalks.VectorLayer('vector', collection)
    .addTo(map);
