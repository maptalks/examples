
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
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

var marker = new maptalks.Marker(map.getCenter(), {
  symbol: [
    {
      'markerType' : 'square',
      'markerFill' : 'rgba(216,115,149,0.8)',
      'markerWidth' : 120,
      'markerHeight' : 120
    },
    {
      'textName' : 'Click\non Me',
      'textSize' : 18
    }
  ]
})
.addTo(layer);

function addListen() {
  //mousemove and touchmove is annoying, so not listening to it.
  marker.on('mousedown mouseup click dblclick contextmenu touchstart touchend', onEvent);
}
function removeListen() {
  //mousemove and touchmove is annoying, so not listening to it.
  marker.off('mousedown mouseup click dblclick contextmenu touchstart touchend', onEvent);
}

var events = [];

function onEvent(param) {
  events.push(param);
  var content = '';
  for (var i = events.length - 1; i >= 0; i--) {
    content += events[i].type + ' on ' +
      events[i].coordinate.toArray().map(function (c) { return c.toFixed(5); }).join() +
      '<br>';
  }
  document.getElementById('events').innerHTML = '<div>' + content + '</div>';
  //return false to stop event propagation
  return false;
}
