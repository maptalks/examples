
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([121.485428, 31.228541], {
  'symbol' :{
    'markerType' : 'square',
    'markerWidth' : 50,
    'markerHeight' : 50
  }
}).addTo(layer);

var animtaionStyles = {
  symbol: {
    'markerWidth' : 200,
    'markerHeight' : 200
  }
};
var options = {speed: 1000, easing: 'inAndOut'};
function step(frame) {
  if (frame.state.playState === 'running') {
    marker.updateSymbol(frame.styles.symbol);
  }
}
var animation = maptalks.Animation.animate(animtaionStyles, options, step).play();
