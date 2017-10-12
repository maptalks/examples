var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  6,
  pitch : 40,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer : new maptalks.TileLayer('base',{
    'urlTemplate': 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}.png',
    'subdomains'  : ['a','b','c','d']
  }),
  // additional TileLayers in create options
  layers : [
    new maptalks.TileLayer('boudaries',{
      'urlTemplate': 'https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_only_labels/{z}/{x}/{y}.png',
      'subdomains'  : ['a','b','c','d']
    })
  ]
});
