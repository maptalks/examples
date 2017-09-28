var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var textbox = new maptalks.TextBox(
  'This is a textbox, with very long content', // content
  [-0.113049, 51.498568],  // coordinate
  200,                 // width
  90,                  // height
  {
    'draggable' : true,
    'textStyle' : {
      'wrap' : true,          // auto wrap text
      'padding' : [12, 8],    // padding of textbox
      'verticalAlignment' : 'top',
      'horizontalAlignment' : 'right',
      'symbol' : {
        'textFaceName' : 'monospace',
        'textFill' : '#34495e',
        'textHaloFill' : '#fff',
        'textHaloRadius' : 4,
        'textSize' : 18,
        'textWeight' : 'bold'
      }
    },
    'boxSymbol': {
      // box's symbol
      'markerType' : 'square',
      'markerFill' : 'rgb(135,196,240)',
      'markerFillOpacity' : 0.9,
      'markerLineColor' : '#34495e',
      'markerLineWidth' : 1
    }
  });

new maptalks.VectorLayer('vector', textbox).addTo(map);

startEdit();

function startEdit() {
  textbox.startEdit();
}

function endEdit() {
  textbox.endEdit();
}
