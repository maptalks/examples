var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14.8,
  zoomControl : true,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});
