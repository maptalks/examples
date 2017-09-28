var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch : 60,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

// point with altitude
var point = new maptalks.Marker(
  [-0.113049, 51.498568],
  {
    properties : {
      altitude : 400
    }
  }
);

// same point without altitude
var point0 = new maptalks.Marker(
  [-0.113049, 51.498568]
).updateSymbol({
  markerOpacity : 0.5,
  markerFill : '#bbb'
});

new maptalks.VectorLayer('vector', [point], {
  enableAltitude : true,        // enable altitude
  altitudeProperty : 'altitude', // altitude property in properties, default by 'altitude'
  drawAltitude : {
    lineWidth : 1,
    lineColor : '#000'
  }
}).addTo(map);
