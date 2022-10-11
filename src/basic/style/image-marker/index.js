const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const center = map.getCenter();

const layer = new maptalks.VectorLayer('vector').addTo(map);

const marker1 = new maptalks.Marker(center.sub(0.009, 0), {
  symbol: {
    markerFile: '{res}/markers/1.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker2 = new maptalks.Marker(center.sub(0.006, 0), {
  symbol: {
    markerFile: '{res}/markers/2.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker3 = new maptalks.Marker(center.sub(0.003, 0), {
  symbol: {
    markerFile: '{res}/markers/3.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker4 = new maptalks.Marker(center, {
  symbol: {
    markerFile: '{res}/markers/4.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker5 = new maptalks.Marker(center.add(0.003, 0), {
  symbol: {
    markerFile: '{res}/markers/5.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);

const marker6 = new maptalks.Marker(center.add(0.006, 0), {
  symbol: {
    markerFile: '{res}/markers/6.png',
    markerWidth: 28,
    markerHeight: 40,
    markerDx: 0,
    markerDy: 0,
    markerOpacity: 1,
  },
}).addTo(layer);
