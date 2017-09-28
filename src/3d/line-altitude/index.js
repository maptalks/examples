var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch : 60,
  bearing : 60,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var line = new maptalks.LineString([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568],
  [-0.107049, 51.496568]
], {
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  },
  properties : {
    'altitude' : 400
  }
});

// same line without alitutde
var line0 = new maptalks.LineString([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568]
], {
  symbol: {
    'lineColor' : '#000',
    'lineDasharray' : [10, 5, 5],
    'lineWidth' : 3
  }
});

new maptalks.VectorLayer('vector', [line], { enableAltitude : true, drawAltitude : {
  polygonFill : '#1bbc9b',
  polygonOpacity : 0.3,
  lineWidth : 3,
  lineDasharray : [10, 5, 5],
  lineColor : '#bbb'
}}).addTo(map);
