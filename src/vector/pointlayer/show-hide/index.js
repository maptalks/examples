const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const pointLayer = new maptalks.PointLayer('point');

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: {
    textName: 'Layer is shown.',
    textWeight: 'bold',
    textSize: 50,
    textFill: '#1bbc9b',
    textHaloFill: '#fff',
    textHaloRadius: 5,
  },
}).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);

function show() {
  pointLayer.show();
}

function hide() {
  pointLayer.hide();
}
