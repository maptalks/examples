const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 13,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const layer = new maptalks.VectorLayer('vector').addTo(map);

const rect = new maptalks.Rectangle(
  map.getCenter().add(-0.03, 0.01),
  4250,
  3000,
  {
    symbol: {
      lineColor: '#fff',
      polygonPatternFile: '{res}/patterns/fill-pattern.png',
      polygonOpacity: 1,
    },
  }
).addTo(layer);
