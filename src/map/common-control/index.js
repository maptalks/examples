var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  pitch : 45,
  attribution: {
    content: '$(attribution)'
  },
  zoomControl : true, // add zoom control
  scaleControl : true, // add scale control
  overviewControl : true, // add overview control
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
