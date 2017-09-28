var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 13,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var c = map.getCenter();

var marker0 = new maptalks.Marker(
  c.sub(0.02, -0.01),
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

var marker1 = new maptalks.Marker(
  c.sub(0.015, 0.01),
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

var marker2 = new maptalks.Marker(
  c,
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


var marker3 = new maptalks.Marker(
  c.add(0.015, 0),
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
