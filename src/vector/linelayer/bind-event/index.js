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
const line = new maptalks.LineString(
  [
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
  ],
  {
    symbol: {
      lineColor: '#1bbc9b',
      lineWidth: 6,
    },
  }
).addTo(lineLayer);

line.on('click', () => {
  document.getElementById('info').innerHTML = '响应鼠标点击事件';
});

const groupLayer = new maptalks.GroupGLLayer('group', [lineLayer]).addTo(map);
