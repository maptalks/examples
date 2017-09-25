var map = new maptalks.Map('map', {
  center:     [114.26529, 30.60545],
  zoom:  13,
  attribution: {
    content: '$(attribution)'
  },
  dragPitch : false,
  baseLayer : new maptalks.TileLayer('base',{
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

//boundary is the coordinates from boundary.js
var mask = new maptalks.Polygon(boundary, {
  'symbol' : [
    {
      'lineColor' : '#ccc',
      'lineWidth' : 8,
      'polygonFillOpacity' : 0
    },
    {
      'lineColor' : '#404040',
      'lineWidth' : 6,
      'polygonFillOpacity' : 0
    }
  ]
});

var outline = mask.copy();

var maskedLayer = new maptalks.TileLayer('masked', {
  'urlTemplate' : 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
  'subdomains'  : ['a','b','c','d','e']
})
.setMask(mask)
.addTo(map);

var title = new maptalks.Marker(mask.getCenter(), {
  'symbol' : {
    'textName' : 'JiangHan District',
    'textFaceName' : 'sans-serif',
    'textSize' : 32,
    'textFill' : '#1bbc9b',
    'textHaloFill' : '#fff',
    'textHaloRadius' : 5,
    'textDx' : -30
  }
});
new maptalks.VectorLayer('v', [outline, title]).addTo(map);
