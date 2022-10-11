const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const layer = new maptalks.VectorLayer('vector').addTo(map);

const marker = new maptalks.Marker([-0.113049, 51.49856], {
  symbol: [
    {
      markerFile: '{res}/markers/avatar.jpg',
      markerWidth: 29,
      markerHeight: 29,
      markerDy: -20,
    },
    {
      markerFile: '{res}/markers/marker.png',
    },
  ],
}).addTo(layer);
