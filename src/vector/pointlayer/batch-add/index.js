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

const marker1 = new maptalks.Marker([-0.131049, 51.499568], {
  symbol: {
    textFaceName: 'sans-serif',
    textName: 'MapTalks',
    textFill: '#22be9e',
    textSize: 40,
  },
});

const marker2 = new maptalks.Marker([-0.097049, 51.499568], {
  symbol: {
    textFaceName: 'sans-serif',
    textName: 'MapTalks',
    textFill: '#22be9e',
    textSize: 40,
  },
});

const marker3 = new maptalks.Marker([-0.097049, 51.495568], {
  symbol: {
    textFaceName: 'sans-serif',
    textName: 'MapTalks',
    textFill: '#22be9e',
    textSize: 40,
  },
});

const marker4 = new maptalks.Marker([-0.131049, 51.495568], {
  symbol: {
    textFaceName: 'sans-serif',
    textName: 'MapTalks',
    textFill: '#22be9e',
    textSize: 40,
  },
});

pointLayer.addGeometry([marker1, marker2, marker3, marker4]);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);
