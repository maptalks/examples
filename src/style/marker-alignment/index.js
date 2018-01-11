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

var center = map.getCenter();

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker1 = new maptalks.Marker(
  center.add(0.01, 0),
  {
    'symbol' : {
      'textName' : 'm4',
      'textSize' : 14,
      'markerFile'   : 'm4.png',
      'markerHorizontalAlignment' : 'middle', // left, middle(default), right
      'markerVerticalAlignment' : 'middle'    // top, middle, bottom(default)
    }
  }
).addTo(layer);

var marker2 = new maptalks.Marker(
  center.add(-0.01, 0),
  {
    'symbol' : {
      'textName' : 'm5',
      'textSize' : 14,
      'markerFile'   : 'm5.png',
      'markerHorizontalAlignment' : 'middle', // left, middle(default), right
      'markerVerticalAlignment' : 'middle'    // top, middle, bottom(default)
    }
  }
).addTo(layer);
