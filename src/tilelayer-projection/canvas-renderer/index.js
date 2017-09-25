var map = new maptalks.Map('map', {
  center:     [-0.113049,51.498568],
  zoom:  13,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer : new maptalks.TileLayer('base',{
    renderer : 'canvas', // set TileLayer's renderer to canvas
    // crossOrigin : 'anonymous',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
