
var map1 = new maptalks.Map('map1', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var map2 = new maptalks.Map('map2', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer1 = new maptalks.VectorLayer('vector').addTo(map1);
var layer2 = new maptalks.VectorLayer('vector').addTo(map2);

var polygon = new maptalks.Polygon([
  [121.478765, 31.243709],
  [121.493355, 31.242659],
  [121.493355, 31.223344],
  [121.488332, 31.220102],
  [121.478321, 31.234567]
], {
  symbol: {
    lineColor: 'ForestGreen',
    lineWidth: 2,
    polygonFill: '#abc',
    polygonOpacity: 0.7
  }
}).addTo(layer1);

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Copy',
      click: function () {
        var copy = polygon.copy();
        copy.setSymbol({
          lineColor: 'ForestGreen',
          lineWidth: 2,
          polygonFill: 'Burlywood',
          polygonOpacity: 0.7
        });
        copy.addTo(layer2);
      }
    }
  ]
}).addTo(map1);
