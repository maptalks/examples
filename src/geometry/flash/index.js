
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
      'textFaceName' : '"microsoft yahei",arial,sans-serif',
      'textName' : 'FLASH\nME',
      'textFill' : '#34495e',
      'textSize' : 40,
      'textWrapCharacter' : '\n',
      'textHaloColor' : 'white',
      'textHaloRadius' : 8
    }
  }
);

var layer = new maptalks.VectorLayer('vector')
    .addGeometry(marker)
    .addTo(map);

function flash() {
  marker.flash(200, 5);
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Flash',
      click: function () {
        flash();
      }
    }
  ]
}).addTo(map);
