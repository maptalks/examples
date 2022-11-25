var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var multiPolygon = new maptalks.MultiPolygon([
  [[[-0.131049, 51.503568], [-0.107049, 51.503568], [-0.107049, 51.501568], [-0.131049, 51.501568]]],
  [[[-0.131049, 51.498568], [-0.107049, 51.498568], [-0.107049, 51.496568], [-0.131049, 51.496568]]],
  [[[-0.131049, 51.493568], [-0.107049, 51.493568], [-0.107049, 51.491568], [-0.131049, 51.491568]]]
], {
  visible : true,
  editable : true,
  cursor : null,
  draggable : false,
  dragShadow : false, // display a shadow during dragging
  drawOnAxis : null,  // force dragging stick on a axis, can be: x, y
  symbol: {
    'lineColor' : '#34495e',
    'lineWidth' : 2,
    'polygonFill' : 'rgb(135,196,240)',
    'polygonOpacity' : 0.6
  }
});

new maptalks.VectorLayer('vector', multiPolygon).addTo(map);
