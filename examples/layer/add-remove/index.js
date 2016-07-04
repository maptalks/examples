
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker([121.487542, 31.239812]);
var layer = new maptalks.VectorLayer('vector')
    .addGeometry(marker);

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Add Layer',
      click: function () {
        map.addLayer(layer);
      }
    },
    {
      item: 'Remove Layer',
      click: function () {
        map.removeLayer(layer);
      }
    }
  ]
}).addTo(map);
