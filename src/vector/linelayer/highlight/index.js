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
const lines = [];
for (let i = 0; i < 3; i++) {
  const line = new maptalks.LineString(
    [
      [-0.123049 + 0.02 * i, 51.500568],
      [-0.136049 + 0.02 * i, 51.500568],
    ],
    {
      symbol: {
        lineColor: '#1bbc9b',
        lineWidth: 3,
      },
    }
  ).addTo(lineLayer);
  line
    .on('mouseenter', function (e) {
      e.target.updateSymbol({
        lineColor: '#f00',
        lineWidth: 5,
      });
    })
    .on('mouseout', function (e) {
      e.target.updateSymbol({
        lineColor: '#1bbc9b',
        lineWidth: 3,
      });
    });
  lines.push(line);
}

function hightlight() {
  lines.forEach(function (line) {
    line.updateSymbol({
      lineColor: '#f00',
      lineWidth: 5,
    });
  });
}

function cancelHightlight() {
  lines.forEach(function (line) {
    line.updateSymbol({
      lineColor: '#1bbc9b',
      lineWidth: 3,
    });
  });
}
const groupLayer = new maptalks.GroupGLLayer('group', [lineLayer]).addTo(map);
