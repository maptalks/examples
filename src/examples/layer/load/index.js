var marker = new maptalks.Marker(
  [-0.113049,51.498568],
  {
    symbol : {
      'textName' : 'Layer is loaded.',
      'textWeight' : 'bold',
      'textSize' : 50,
      'textFill' : '#1bbc9b',
      'textHaloFill' : '#fff',
      'textHaloRadius' : 5
    }
  }
);

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(marker);

var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  layers: [
    layer
  ]
});
