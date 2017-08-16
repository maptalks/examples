
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
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

var marker1 = new maptalks.Marker(
  map.getCenter().sub(0.009, 0),
  {
    'symbol' : {
      'markerFile'   : '1.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);

var marker2 = new maptalks.Marker(
  map.getCenter().sub(0.006, 0),
  {
    'symbol' : {
      'markerFile'   : '2.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);

var marker3 = new maptalks.Marker(
  map.getCenter().sub(0.003, 0),
  {
    'symbol' : {
      'markerFile'   : '3.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);

var marker4 = new maptalks.Marker(
  map.getCenter(),
  {
    'symbol' : {
      'markerFile'   : '4.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);

var marker5 = new maptalks.Marker(
  map.getCenter().add(0.003, 0),
  {
    'symbol' : {
      'markerFile'   : '5.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);

var marker6 = new maptalks.Marker(
  map.getCenter().add(0.006, 0),
  {
    'symbol' : {
      'markerFile'   : '6.png',
      'markerWidth'  : 28,
      'markerHeight' : 40
    }
  }
).addTo(layer);
