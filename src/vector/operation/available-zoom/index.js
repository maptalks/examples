const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  zoomControl: true,
});

// The highest level of tiles is level 16
// When the map is at level 16 or higher, the tiles of level 16 are still loaded
const vt = new maptalks.VectorTileLayer('vt', {
  urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
  spatialReference: 'preset-vt-3857',
  maxAvailableZoom: 15,
});

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
