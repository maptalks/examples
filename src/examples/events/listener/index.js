var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
//<<<<<<<< prepare data
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
//>>>>>>>>

addListener();

var events = [];

function onEvent(param) {
  events.push(param);
  var content = '';
  for (var i = events.length - 1; i >= 0; i--) {
    content += events[i].type + ' on ' +
      events[i].coordinate.toFixed(4).toArray().join() +
      '<br>';
  }
  document.getElementById('info').innerHTML = '<div>' + content + '</div>';
  return false;
}

function addListener() {
  marker.on('mousedown mouseup click dblclick contextmenu touchstart touchend', onEvent);
}

function removeListener() {
  marker.off('mousedown mouseup click dblclick contextmenu touchstart touchend', onEvent);
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Listen',
      click: addListener
    },
    {
      item: 'Unlisten',
      click: removeListener
    }
  ]
}).addTo(map);
