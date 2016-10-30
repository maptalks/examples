
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker3 = new maptalks.Marker(
  map.getCenter().substract(0.02, -0.01),
  {
    'symbol' : {
      'markerType': 'ellipse',
      'markerFillPatternFile': 'fill-pattern.png',
      'markerLineColor': '#fff',
      'markerWidth'  : 120,
      'markerHeight' : 120
    }
  }
).addTo(layer);

var marker4 = new maptalks.Marker(
  map.getCenter().substract(0.015, 0.01),
  {
    'symbol' : {
      'markerType': 'triangle',
      'markerFillPatternFile': 'fill-pattern.png',
      'markerLineColor': '#fff',
      'markerWidth'  : 120,
      'markerHeight' : 120
    }
  }
).addTo(layer);

var marker5 = new maptalks.Marker(
  map.getCenter(),
  {
    'symbol' : {
      'markerType': 'square',
      'markerFillPatternFile': 'fill-pattern.png',
      'markerLineColor': '#fff',
      'markerWidth'  : 120,
      'markerHeight' : 120
    }
  }
).addTo(layer);


var marker6= new maptalks.Marker(
  map.getCenter().add(0.015, 0),
  {
    'symbol' : {
      'markerType': 'diamond',
      'markerFillPatternFile': 'fill-pattern.png',
      'markerLineColor': '#fff',
      'markerWidth'  : 120,
      'markerHeight' : 120
    }
  }
).addTo(layer);
