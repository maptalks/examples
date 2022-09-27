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
      lineColor: '#34495e',
      lineWidth: 2,
      polygonFill: 'rgb(135,196,240)',
      polygonOpacity: 0.6,
      markerType: 'ellipse',
      markerFill: '#1bbc9b',
      markerLineColor: '#000',
      markerWidth: 30,
      markerHeight: 30,
      markerPlacement: 'vertex', // point, vertex, vertex-first, vertex-last, line
      markerVerticalAlignment: 'middle',
      textName: 'A',
      textPlacement: 'vertex', // point, vertex, vertex-first, vertex-last, line
      textFill: '#fff',
    },
  }
).addTo(layer);

const groupLayer = new maptalks.GroupGLLayer('group', [layer]);
groupLayer.addTo(map);
