var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  6,
  pitch : 40,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer : new maptalks.TileLayer('base',{
    urlTemplate: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
    'subdomains': ['a','b']
  }),
  // additional TileLayers in create options
  layers : [
    new maptalks.TileLayer('boudaries',{
      urlTemplate: 'http://korona.geog.uni-heidelberg.de/tiles/adminb/x={x}&y={y}&z={z}'
    })
  ]
});
