var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('tile', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('v').addTo(map);

var c = map.getCenter();

// based on function-type v0.18.0 plus support of identity
// https://www.mapbox.com/mapbox-gl-js/style-spec/#types-function
var symbol = {
  'markerType': 'ellipse',
  'markerFill': 'rgb(216,115,149)',
  'markerFillOpacity': { // use heat value in property
    'property': 'heat',
    'type' : 'identity'
  },
  'markerLineWidth': 0,
  'markerLineOpacity': 1,
  'markerWidth': 40,
  'markerHeight': 40
};

var marker1 = new maptalks.Marker(
  c.sub(0.020, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 1
    }
  }
).addTo(layer);

var marker2 = new maptalks.Marker(
  c.sub(0.015, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.9
    }
  }
).addTo(layer);

var marker3 = new maptalks.Marker(
  c.sub(0.010, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.8
    }
  }
).addTo(layer);

var marker4 = new maptalks.Marker(
  c.sub(0.005, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.7
    }
  }
).addTo(layer);

var marker5 = new maptalks.Marker(
  c,
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.6
    }
  }
).addTo(layer);


var marker6 = new maptalks.Marker(
  c.add(0.005, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.5
    }
  }
).addTo(layer);

var marker7 = new maptalks.Marker(
  c.add(0.010, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.4
    }
  }
).addTo(layer);

var marker8 = new maptalks.Marker(
  c.add(0.015, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.3
    }
  }
).addTo(layer);

var marker9 = new maptalks.Marker(
  c.add(0.020, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.2
    }
  }
).addTo(layer);

var marker10 = new maptalks.Marker(
  c.add(0.025, 0),
  {
    'symbol' : symbol,
    'properties' : {
      'heat' : 0.1
    }
  }
).addTo(layer);

