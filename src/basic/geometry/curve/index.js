var map = new maptalks.Map('map', {
  center: [-0.11505,51.4985],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var c = new maptalks.Coordinate(-0.11305,51.4985);

var arc = new maptalks.ArcCurve([
  c.add(-0.0202, 0.0081),
  c.add(-0.0269, 0.0069),
  c.add(-0.0369, 0.0032),
  c.add(-0.0314, -0.003),
  c.add(-0.0278, -0.008),
  c.add(-0.0220, -0.009)
], {
  'symbol' : getSymbol('Arc')
});

var quad = new maptalks.QuadBezierCurve([
  c.add(-0.0102, 0.0081),
  c.add(-0.0169, 0.0069),
  c.add(-0.0211, 0.0032),
  c.add(-0.0214, -0.0033),
  c.add(-0.0178, -0.0086),
  c.add(-0.0120, -0.0095)
], {
  'symbol' : getSymbol('Quadratic\nBézier')
});

var cubic = new maptalks.CubicBezierCurve([
  c.add(-0.0002, 0.0081),
  c.add(-0.0069, 0.0069),
  c.add(-0.0069, 0.0032),
  c.add(-0.0114, -0.0033),
  c.add(-0.0078, -0.0086),
  c.add(-0.0020, -0.0095)
], {
  'symbol' : getSymbol('Cubic\nBézier')
});

new maptalks.VectorLayer('vector', [arc, quad, cubic]).addTo(map);

function getSymbol(title) {
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
    },
    {
      textName : title,
      textFill : '#f00',
      textWeight : 'bold',
      textHaloColor : '#fff',
      textHaloRadius : 3,
      textSize : 20,
      textWrapCharacter : '\n'
    }
  ];
}
