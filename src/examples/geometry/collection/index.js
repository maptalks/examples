var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker(center.add(-0.018,0.007));
var polyline = new maptalks.LineString([
  center.add(-0.018,0.005).toArray(),
  center.add(0.006,0.005).toArray()
]);
var polygon = new maptalks.Polygon([
  center.add(-0.018,0.004).toArray(),
  center.add(0.006,0.004).toArray(),
  center.add(0.006,-0.001).toArray(),
  center.add(-0.018,-0.001).toArray(),
  center.add(-0.018,0.004).toArray()
]);

//collection's symbol will override children's own symbols.
var collection = new maptalks.GeometryCollection([marker, polyline, polygon]);

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(collection)
    .addTo(map);
