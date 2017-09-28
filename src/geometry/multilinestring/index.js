var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var multiline = new maptalks.MultiLineString([
  [[-0.131049, 51.503568], [-0.107049, 51.503568]],
  [[-0.131049, 51.498568], [-0.107049, 51.498568]],
  [[-0.131049, 51.493568], [-0.107049, 51.493568]]
], {
  arrowStyle : null, // arrow-style : now we only have classic
  arrowPlacement : 'vertex-last', // arrow's placement: vertex-first, vertex-last, vertex-firstlast, point
  visible : true,
  editable : true,
  cursor : null,
  shadowBlur : 0,
  shadowColor : 'black',
  draggable : false,
  dragShadow : false, // display a shadow during dragging
  drawOnAxis : null,  // force dragging stick on a axis, can be: x, y
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 3
  }
});

new maptalks.VectorLayer('vector', multiline).addTo(map);
