
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var circle = new maptalks.Circle([121.481355, 31.228344], 600, {
  symbol: {
    polygonFill: '#ffe4e1',
    polygonOpacity: 0.4,
    lineColor: '#228b22',
    lineWidth: 8
  }
}).addTo(layer);

function animation() {
  circle.animate({
    // translate: [0.1, 0.0],
    radius: 900,
    symbol: {
      lineWidth: 2
    }
  }, {
    speed: 500
  });
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Animation',
      click: function () {
        animation();
      }
    }
  ]
}).addTo(map);
