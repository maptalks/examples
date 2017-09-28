var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var marker = new maptalks.Marker(
  map.getCenter(),
  {
    symbol : {
      'textFaceName' : 'sans-serif',
      'textName' : 'FLASH\nME',
      'textFill' : '#34495e',
      'textSize' : 40,
      'textHaloColor' : 'white',
      'textHaloRadius' : 8
    }
  }
);

new maptalks.VectorLayer('vector', marker).addTo(map);

function flash() {
  marker.flash(
    200,  //flash interval in ms
    5,    // count
    function () { // callback when flash end
      alert('flash ended');
    });
}
