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
pointLayer.setStyle([
  {
    filter: true,
    symbol: {
      textFaceName: 'sans-serif',
      textName: 'MapTalks',
      textFill: '#22be9e',
      textSize: 40,
    },
  },
]);

const marker = new maptalks.MultiPoint([
  [-0.131049, 51.499568],
  [-0.097049, 51.499568],
  [-0.097049, 51.495568],
  [-0.131049, 51.495568],
]).addTo(pointLayer);

const groupLayer = new maptalks.GroupGLLayer('group', [pointLayer]);
groupLayer.addTo(map);

function setStyle() {
  pointLayer.setStyle([
    {
      filter: true,
      symbol: {
        textFaceName: 'sans-serif',
        textName: 'Style',
        textFill: '#f00',
        textSize: 40,
      },
    },
  ]);
}
