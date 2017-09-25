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

var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker(map.getCenter()).addTo(layer);

var start = map.getCenter(),
  offset = getOffset(),
  end = start.add(offset);

var arrow = new maptalks.LineString(
  [start, end],
  {
    'id' : 'arrow',
    'arrowStyle' : 'classic',
    'arrowPlacement' : 'vertex-last'
  }
)
.addTo(layer);

function animate() {
  marker.setCoordinates(start);
  marker.bringToFront()
    .animate({
      translate: [offset['x'], offset['y']]
    }, {
      duration: 2000
    });
}

function getOffset() {
  var center = map.getCenter();
  var extent = map.getExtent();
  marker.setCoordinates(center);
  return extent.getMax().sub(map.getCenter()).multi(1 / 2);
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Animate',
      click: function () {
        animate();
      }
    }
  ]
})
.addTo(map);
