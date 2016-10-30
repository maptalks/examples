
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    crossOrigin: 'anonymous',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker = new maptalks.Marker([-0.113049,51.498568], {
  symbol: [
    {
      'markerType' : 'square',
      'markerFill' : 'rgb(216,115,149)',
      'markerFillOpacity' : 0.8,
      'markerLineColor' : '#fff',
      'markerLineWidth' : 3,
      'markerWidth' : 120,
      'markerHeight' : 120
    },
    {
      'textName' : 'Click\non Me',
      'textFaceName' : '"microsoft yahei",arial,sans-serif',
      'textSize' : 18,
      'textFill' : '#fff',
      'textWrapCharacter' : '\n'
    }
  ]
})
.addTo(layer);

//mousemove and touchmove is annoying, so not listening to it.
marker.on('mousedown mouseup click dblclick contextmenu touchstart touchend', onEvent);

var events = [];

function onEvent(param) {
  events.push(param);
  var content = '';
  for (var i = events.length - 1; i >= 0; i--) {
    content += events[i].type + ' on ' + events[i].coordinate.toArray().map(function (c) { return c.toFixed(5); }).join() + '<br>';
  }
  document.getElementById('events').innerHTML = '<div>' + content + '</div>';
  //return false to stop event propagation
  return false;
}
