var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  //allow map to drag pitching, true by default
  dragPitch : true,
  //allow map to drag rotating, true by default
  dragRotate : true,
  //enable map to drag pitching and rotating at the same time, false by default
  dragRotatePitch : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers: [
    new maptalks.VectorLayer('v')
  ]
});
