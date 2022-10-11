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

const c = map.getCenter();

const marker0 = new maptalks.Marker(c.sub(0.02, -0.01), {
  symbol: {
    markerType: 'ellipse',
    markerFillPatternFile: '{res}/patterns/fill-pattern.png',
    markerLineColor: '#fff',
    markerWidth: 120,
    markerHeight: 120,
  },
}).addTo(layer);

const marker1 = new maptalks.Marker(c.sub(0.015, 0.01), {
  symbol: {
    markerType: 'triangle',
    markerFillPatternFile: '{res}/patterns/fill-pattern.png',
    markerLineColor: '#fff',
    markerWidth: 120,
    markerHeight: 120,
  },
}).addTo(layer);

const marker2 = new maptalks.Marker(c, {
  symbol: {
    markerType: 'square',
    markerFillPatternFile: '{res}/patterns/fill-pattern.png',
    markerLineColor: '#fff',
    markerWidth: 120,
    markerHeight: 120,
  },
}).addTo(layer);

const marker3 = new maptalks.Marker(c.add(0.015, 0), {
  symbol: {
    markerType: 'diamond',
    markerFillPatternFile: '{res}/patterns/fill-pattern.png',
    markerLineColor: '#fff',
    markerWidth: 120,
    markerHeight: 120,
  },
}).addTo(layer);
