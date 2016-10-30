var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var src = new maptalks.Marker(
  center.add(-0.025475,-0.001).toArray(),
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
).addTo(layer);

var dst = new maptalks.Marker(
  center.add(0.009917,-0.001).toArray(),
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
).addTo(layer);

var line = new maptalks.ConnectorLine(src, dst, {
  curveType : 0, //0, 1, 2, 3
  showOn : 'always', //'moving', 'click', 'mouseover', 'always'
  arrowStyle : 'classic',
  arrowPlacement : 'vertex-last', //vertex-first, vertex-last, vertex-firstlast, point
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2
  }
}).addTo(layer);
