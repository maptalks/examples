var marker = new maptalks.Marker(
  [121.48542888885189, 31.228541533313702],
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
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  layers: [
    layer
  ]
});
