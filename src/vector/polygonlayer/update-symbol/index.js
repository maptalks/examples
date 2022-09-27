const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const layer = new maptalks.PolygonLayer('polygon');

const polygon = new maptalks.Polygon(
  [
    [
      [-0.131049, 51.498568],
      [-0.107049, 51.498568],
      [-0.107049, 51.493568],
      [-0.131049, 51.493568],
      [-0.131049, 51.498568],
    ],
  ],
  {
    symbol: {
      polygonFill: 'rgb(135,196,240)',
      polygonOpacity: 1,
      lineColor: '#1bbc9b',
      lineWidth: 6,
    },
  }
).addTo(layer);

const groupLayer = new maptalks.GroupGLLayer('group', [layer]);
groupLayer.addTo(map);

// only update rectangle's polygonFill
function updateFill() {
  polygon.updateSymbol({
    polygonFill: 'rgb(216,115,149)',
  });
}
