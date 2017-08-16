
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  maxZoom : 14,
  minZoom : 7,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

function toolbar(text) {
  var toolbar = new maptalks.control.Toolbar({
    position: 'top-right',
    items: [{
      item: text,
      click: function () {}
    }]
  });
  return toolbar;
}
toolbar('<div class="attr">Size changes with zoom</div>').addTo(map);

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([-0.113049, 51.49856], {
  symbol : [
    {
      'markerType' : 'ellipse',
      'markerWidth'  : { stops: [[7, 5], [14, 200]] },
      'markerHeight' : { stops: [[7, 5], [14, 200]] },
      'markerFill'  : '#18987f',
      'markerFillOpacity'  : 0.6,
      'markerLineColor' : '#34495e',
      'markerLineWidth' : 5
    },
    {
      'textFaceName' : 'sans-serif',
      'textName' : 'MapTalks',
      'textFill' : '#fff',
      'textSize'  : { stops: [[7, 2], [14, 30]] }
    }
  ]
}).addTo(layer);
