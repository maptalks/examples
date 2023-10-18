var map = new maptalks.Map('map', {
  center: [-0.113049, 51.503568],
  zoom: 14,
  pitch : 56,
  bearing : 30,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

//line with one altitude
var line1 = new maptalks.LineString([
  [-0.131049, 51.498568, 200],
  [-0.107049, 51.498568, 200],
  [-0.093049, 51.498568, 200]
], {
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3,
    'textName'  : '{altitudeValue}',
    'textPlacement' : 'vertex'
  },
  properties : {
    'altitudeValue' : 200  //altitude for all vertexes
  }
});

// line with seperate alitutdes
var line2 = new maptalks.LineString([
  [-0.131049, 51.498568, 400],
  [-0.107049, 51.498568, 600],
  [-0.093049, 51.498568, 1200]
], {
  properties : {
    'altitudeValue' : [400, 600, 1200]
  },
  symbol: {
    'lineColor' : 'rgb(135,196,240)',
    'lineWidth' : 3,
    'textName'  : '{altitudeValue}',
    'textPlacement' : 'vertex'
  }
});

// line without alitutde
var line0 = new maptalks.LineString([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568],
  [-0.093049, 51.498568]
], {
  symbol: {
    'lineColor' : '#000',
    'lineDasharray' : [10, 5, 5],
    'lineWidth' : 3,
    'textName'  : '0',
    'textPlacement' : 'vertex'
  }
});

new maptalks.VectorLayer('vector', [line0, line1, line2], { enableAltitude : true }).addTo(map);
