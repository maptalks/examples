var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker(
  [-0.113049,51.49856],
  {
    'symbol' : [
      {
        'markerFile'   : 'avatar.jpg',
        'markerWidth'  : 29,
        'markerHeight' : 29,
        'markerDy'     : -20
      },
      {
        'markerFile'   : 'marker.png'
      }
    ]
  }
).addTo(layer);
