const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
});

fetch('http://tile.maptalks.com/test/planet-single/tiles.json')
  .then((response) => response.json())
  .then((data) => {
    const vt = new maptalks.VectorTileLayer('vt', {
      urlTemplate: data.tiles[0],
      spatialReference: 'preset-vt-3857',
    });
    const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
    groupLayer.addTo(map);
  });
