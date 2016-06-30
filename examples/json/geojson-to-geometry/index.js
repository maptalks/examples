
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var json = {
  "type": "Feature",
  "geometry": {
    "type": "Point",
    "coordinates": [121.485428, 31.228541],
  },
  "properties": {
    "name": "point marker"
  }
};
var marker = maptalks.GeoJSON.toGeometry(json);
var layer = new maptalks.VectorLayer('vector').addTo(map);
layer.addGeometry(marker);
