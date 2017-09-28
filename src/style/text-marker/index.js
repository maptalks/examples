
var map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var text = new maptalks.Marker(
  [-0.113049, 51.49856],
  {
    'properties' : {
      'name' : 'Hello\nMapTalks'
    },
    'symbol' : {
      'textFaceName' : 'sans-serif',
      'textName' : '{name}',          //value from name in geometry's properties
      'textWeight'        : 'normal', //'bold', 'bolder'
      'textStyle'         : 'normal', //'italic', 'oblique'
      'textSize'          : 40,
      'textFont'          : null,     //same as CanvasRenderingContext2D.font, override textName, textWeight and textStyle
      'textFill'          : '#34495e',
      'textOpacity'       : 1,
      'textHaloFill'      : '#fff',
      'textHaloRadius'    : 5,
      'textWrapWidth'     : null,
      'textWrapCharacter' : '\n',
      'textLineSpacing'   : 0,

      'textDx'            : 0,
      'textDy'            : 0,

      'textHorizontalAlignment' : 'middle', //left | middle | right | auto
      'textVerticalAlignment'   : 'middle',   // top | middle | bottom | auto
      'textAlign'               : 'center' //left | right | center | auto
    }
  }
).addTo(layer);
