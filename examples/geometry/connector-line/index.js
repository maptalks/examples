
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var src = new maptalks.Marker(
  [121.459953, 31.227678],
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
  [121.495345, 31.227678],
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
