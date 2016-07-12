
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker([121.467906,31.2351467]);
var polyline = new maptalks.LineString([
  [121.467906, 31.233055], [121.4913941, 31.233055]
]);
var polygon = new maptalks.Polygon([
  [121.467906, 31.23217],
  [121.491394, 31.23217],
  [121.491394, 31.227255],
  [121.467906, 31.227255],
  [121.467906, 31.23217]
]);

//collection's symbol will override children's own symbols.
var collection = new maptalks.GeometryCollection([marker, polyline, polygon]);

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(collection)
    .addTo(map);
