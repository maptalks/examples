var map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var c = map.getCenter();

var line = new maptalks.LineString(
  [c.sub(0.01, 0), c],
  {
    symbol:{
      // linear gradient
      'lineColor' : {
        'type' : 'linear',
        'colorStops' : [
          [0.00, 'red'],
          [1 / 4, 'orange'],
          [2 / 4, 'green'],
          [3 / 4, 'aqua'],
          [1.00, 'white']
        ]
      },
      'lineWidth' : 10
    }
  }).addTo(layer);

var line1 = new maptalks.LineString(
  [c.sub(0.015, 0.005), c.sub(0, 0.005)],
  {
    symbol:{
      // radial gradient
      'lineColor' : {
        'type' : 'radial',
        'colorStops' : [
          [0.00, 'red'],
          [1 / 3, 'orange'],
          [2 / 3, 'green'],
          [1.00, 'white']
        ]
      },
      'lineWidth' : 10
    }
  }).addTo(layer);
