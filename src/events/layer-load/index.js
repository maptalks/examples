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

var layer = new maptalks.VectorLayer('vector', [new maptalks.Marker([-0.113049,51.498568])]);
layer.on('layerload', function () {
  var infoDom = document.getElementById('info');
  infoDom.innerHTML = '<div>' + new Date().toLocaleTimeString() + ': Layer loaded</div>' + infoDom.innerHTML;
});

layer.addTo(map);
