const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  zoomControl: true,
});

// Layers are only displayed between levels 14 and 18
const vt = new maptalks.VectorTileLayer('vt', {
  urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
  spatialReference: 'preset-vt-3857',
  minZoom: 14,
  maxZoom: 18,
});

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
