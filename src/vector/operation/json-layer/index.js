const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
});

const json = {
  type: 'VectorTileLayer',
  id: 'vt',
  options: {
    urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
    spatialReference: 'preset-vt-3857',
  },
};

const vt = maptalks.VectorTileLayer.fromJSON(json);

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
