var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  pitch : 45,
  overviewControl : true, // add overview control
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});
