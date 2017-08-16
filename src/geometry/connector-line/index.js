var c = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: c,
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var src = new maptalks.Marker(
  c.add(-0.0154, 0.005),
  {
    symbol: {
      'markerType' : 'ellipse',
      'markerFill' : 'rgb(135,196,240)',
      'markerFillOpacity' : 0.8,
      'markerLineColor' : '#fff',
      'markerLineWidth' : 3,
      'markerWidth' : 120,
      'markerHeight' : 120
    }
  }
);

var dst = new maptalks.Marker(
  c.add(0.0109, 0.005),
  {
    'draggable' : true,
    'symbol': [
      {
        'markerType' : 'ellipse',
        'markerFill' : 'rgb(216,115,149)',
        'markerFillOpacity' : 0.8,
        'markerLineColor' : '#fff',
        'markerLineWidth' : 3,
        'markerWidth' : 70,
        'markerHeight' : 70
      },
      {
        'textName' : 'Drag\nMe',
        'textSize' : 18,
        'textFill' : '#fff',
        'textWrapCharacter' : '\n'
      }
    ]
  }
);

var line = new maptalks.ConnectorLine(src, dst, {
  showOn : 'always', //'moving', 'click', 'mouseover', 'always'
  arrowStyle : 'classic',
  arrowPlacement : null,// 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2
  }
});

layer.addGeometry(src, dst, line);

// Arc Connector Line
var src2 = src.copy().translate(0, -0.01);
var dst2 = dst.copy().translate(0, -0.01);
var line2 = new maptalks.ArcConnectorLine(src2, dst2, {
  arcDegree : 90,
  showOn : 'always',
  arrowStyle : 'classic',
  arrowPlacement : null,
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2
  }
});

layer.addGeometry(src2, dst2, line2);
