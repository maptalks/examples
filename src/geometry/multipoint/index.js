var center = new maptalks.Coordinate(-0.113049, 51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var multipoint = new maptalks.MultiPoint([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568],
  [-0.107049, 51.493568],
  [-0.131049, 51.493568],
  [-0.131049, 51.498568]
], {
  visible : true,
  editable : true,
  cursor : 'pointer',
  draggable : false,
  dragShadow : false, // display a shadow during dragging
  drawOnAxis : null,  // force dragging stick on a axis, can be: x, y
  symbol : {
    'textFaceName' : 'sans-serif',
    'textName' : 'point',
    'textFill' : '#34495e',
    'textHorizontalAlignment' : 'right',
    'textSize' : 40
  }
});

new maptalks.VectorLayer('vector', multipoint).addTo(map);
