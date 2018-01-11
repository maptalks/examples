var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14.8,
  zoomControl : true,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});
