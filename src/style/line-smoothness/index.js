
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 13,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var c = map.getCenter();

//background red polygon
new maptalks.Polygon([
  c.add(-0.0302, 0.0081),
  c.add(-0.0369, 0.0069),
  c.add(-0.0469, 0.0032),
  c.add(-0.0414, -0.003),
  c.add(-0.0378, -0.008),
  c.add(-0.0320, -0.009)
], {
  'symbol' : {
    'lineColor' : '#f00',
    'shadowBlur' : 10,
    'shadowOffsetX' : 10,
    'shadowOffsetY' : 10
  }
}).addTo(layer);

new maptalks.Polygon([
  c.add(-0.0302, 0.0081),
  c.add(-0.0369, 0.0069),
  c.add(-0.0469, 0.0032),
  c.add(-0.0414, -0.003),
  c.add(-0.0378, -0.008),
  c.add(-0.0320, -0.009)
], {
  smoothness : 0.5,
  'symbol' : getSymbol()
}).addTo(layer);

//background red line
new maptalks.LineString([
  c.add(-0.0202, 0.0081),
  c.add(-0.0269, 0.0069),
  c.add(-0.0369, 0.0032),
  c.add(-0.0314, -0.003),
  c.add(-0.0278, -0.008),
  c.add(-0.0220, -0.009)
], {
  smoothness : 0.5,
  'symbol' : {
    'lineColor' : '#f00',
    'shadowBlur' : 10,
    'shadowOffsetX' : 10,
    'shadowOffsetY' : 10
  }
}).translate(0.04, 0).addTo(layer);

new maptalks.LineString([
  c.add(-0.0202, 0.0081),
  c.add(-0.0269, 0.0069),
  c.add(-0.0369, 0.0032),
  c.add(-0.0314, -0.003),
  c.add(-0.0278, -0.008),
  c.add(-0.0220, -0.009)
], {
  smoothness : 0.5,
  'symbol' : getSymbol()
}).translate(0.04, 0).addTo(layer);


function getSymbol() {
  return [
    {
      lineColor: '#34495e',
      lineWidth: 3
    },
    {
      markerType : 'ellipse',
      markerWidth : 8,
      markerHeight : 8,
      markerFill : '#f00',
      markerPlacement : 'vertex'
    }
  ];
}
