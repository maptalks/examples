const map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const lineLayer = new maptalks.LineStringLayer('linelayer');
const groupLayer = new maptalks.GroupGLLayer('group', [lineLayer]).addTo(map);

function setStyle() {
  lineLayer.setStyle([
    {
      filter: ['==', 'count', 100],
      symbol: getSymbol('#1bbc9b'),
    },
    {
      filter: ['==', 'count', 200],
      symbol: getSymbol('rgb(216,115,149)'),
    },
    {
      filter: ['==', 'count', 300],
      symbol: getSymbol('rgb(135,196,240)'),
    },
  ]);
}

for (let i = 0; i < 3; i++) {
  new maptalks.LineString(
    [
      [-0.123049 + 0.02 * i, 51.503568],
      [-0.136049 + 0.02 * i, 51.503568],
    ],
    {
      properties: {
        count: (i + 1) * 100,
      },
    }
  ).addTo(lineLayer);
}

function getSymbol(color) {
  return [
    {
      polygonFill: color,
      polygonOpacity: 0.5,
      lineColor: '#000',
      lineWidth: 2,
    },
    {
      textName: '{count}',
      textSize: 40,
      textFill: '#f00',
    },
  ];
}
