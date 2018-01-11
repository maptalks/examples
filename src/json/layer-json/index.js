var c = [-0.113049,51.498568];
var map = new maptalks.Map('map', {
  center: c,
  zoom: 13,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v0', [
      new maptalks.Marker(c)
    ]),
    new maptalks.VectorLayer('v1', [
      new maptalks.Rectangle(c, 1000, 800)
    ])
  ]
});

var map1 = new maptalks.Map('map1', {
  center: c,
  zoom: 13,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base1', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
// copy layer by JSON
maptalks.Layer.fromJSON(map.getLayer('v0').toJSON()).addTo(map1);
