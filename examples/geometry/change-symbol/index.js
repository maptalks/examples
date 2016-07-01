
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var polygon = new maptalks.Polygon([
  [121.478765, 31.240309],
  [121.493355, 31.240159],
  [121.498355, 31.223344],
  [121.488332, 31.216102],
  [121.468321, 31.228567]
], {
  symbol: {
    lineColor: 'ForestGreen',
    lineWidth: 2,
    polygonFill: '#abc',
    polygonOpacity: 0.7
  }
}).addTo(layer);

function changeSymbol() {
  polygon.setSymbol({
    lineColor: 'DeepSkyBlue',
    lineWidth: 2,
    polygonFill: 'Burlywood',
    polygonOpacity: 0.7
  });
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Change Symbol',
      click: function () {
        changeSymbol();
      }
    }
  ]
}).addTo(map);
