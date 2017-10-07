var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  6,
  pitch : 40,
  attribution: {
    content: '$(attribution)'
  },
  // add 2 TileLayers with a GroupTileLayer
  baseLayer : new maptalks.GroupTileLayer('base', [
    new maptalks.TileLayer('tile1',{
      urlTemplate: 'http://{s}.tile.stamen.com/watercolor/{z}/{x}/{y}.jpg',
      'subdomains': ['a','b']
    }),
    new maptalks.TileLayer('tile2',{
      urlTemplate: 'http://korona.geog.uni-heidelberg.de/tiles/adminb/x={x}&y={y}&z={z}'
    })
  ])
});
