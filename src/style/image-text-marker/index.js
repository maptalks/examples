
var map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker(
  [-0.113049, 51.49856],
  {
    'properties' : {
      'name' : 'Hello\nMapTalks'
    },
    symbol : [
      {
        'markerFile'   : '3.png',
        'markerWidth'  : 28,
        'markerHeight' : 40
      },
      {
        'textFaceName' : 'sans-serif',
        'textName' : '{name}',
        'textSize' : 14,
        'textDy'   : 24
      }
    ]
  }
).addTo(layer);
