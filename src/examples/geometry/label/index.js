var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var labelNoBox = new maptalks.Label('label without box',
  center.add(-0.013083,-0.002).toArray(),
  {
  'box': false,
  'symbol' : {
    'textWeight' : 'bold',
    'textFaceName' : '"microsoft yahei",arial,sans-serif',
    'textFill' : '#34495e',
    'textSize' : 18,
    'textHaloColor' : '#fff',
    'textHaloRadius' : 3
  }
}).addTo(layer);

var labelWithBox = new maptalks.Label('label with box',
  center.add(0.004,-0.002).toArray(),
  {
  'box'          :   true,
  'boxAutoSize'  :   true,
  'boxMinWidth'  :   0,
  'boxMinHeight' :   0,
  'boxPadding'   :   {'width' : 26, 'height' : 8},
  'boxTextAlign' :   'middle', //left, middle, right
  'symbol': {
    /*'markerLineColor': '#34495e',
    'markerFill' : '#34495e',
    'textFaceName' : '"microsoft yahei",arial,sans-serif',
    'textFill' : '#fff',
    'textVerticalAlignment'   : 'bottom',   // top | middle | bottom | auto
    'textSize' : 18*/
    markerFill:"#4E98DD",
    markerFillOpacity:0.9,
    markerLineColor:"",
    markerLineDasharray:null,
    markerLineOpacity:0.9,
    markerLineWidth:0,
    textDy:5,
    textFaceName:"monospace",
    textFill:"#ff0000",
    textHaloFill:"#ffffff",
    textHaloRadius:4,
    textHorizontalAlignment:"middle",
    textLineSpacing:4,
    textOpacity:1,
    textSize:12,
    textSpacing:1,
    textVerticalAlignment:"bottom",
    textWrapBefore:false,
    textWrapCharacter:"\n",
    textWrapWidth:null
  }
}).addTo(layer);
