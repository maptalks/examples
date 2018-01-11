var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

//globalCompositeOperation on MDN:
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/globalCompositeOperation
var layer = new maptalks.VectorLayer('v', { globalCompositeOperation : 'difference' }).addTo(map);

//prepare data
var center = map.getCenter(), width = 0.055, height = 0.03,
  markers = [],
  colors = ['#f00', '#0f0', '#00f'];
for (var i = 0; i <= 50; i++) {
  var x = center.x + (Math.random() - 0.5) * width * 0.5;
  var y = center.y + (Math.random() - 0.5) * height * 0.5;
  var color = colors[Math.floor(Math.random() * 3)];
  markers.push(new maptalks.Marker([x, y], {
    'symbol' : {
      'markerType' : 'ellipse',
      'markerFill' : color,
      'markerFillOpacity' : 1,
      'markerLineWidth' : 1,
      'markerLineColor' : color,
      'markerWidth' : 70,
      'markerHeight' : 70
    }
  }));
}
layer.addGeometry(markers);
