var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var line = new maptalks.LineString([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568]
], {
  arrowStyle : null, // arrow-style : now we only have classic
  arrowPlacement : 'vertex-last', // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
  visible : true,
  editable : true,
  cursor : null,
  draggable : false,
  dragShadow : false, // display a shadow during dragging
  drawOnAxis : null,  // force dragging stick on a axis, can be: x, y
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  }
});

new maptalks.VectorLayer('vector', line).addTo(map);
