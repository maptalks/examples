var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var line = new maptalks.LineString([
  [-0.131049, 51.498568],
  [-0.107049, 51.498568],
  [-0.107049, 51.491568]
], {
  visible : false,
  arrowStyle : 'classic',
  arrowPlacement : 'vertex-last',
  symbol: {
    'lineColor' : '#1bbc9b',
    'lineWidth' : 6
  }
});

new maptalks.VectorLayer('vector', line).addTo(map);

replay();

function replay() {
  line.hide();
  //line's animateShow
  line.animateShow({
    duration : 1500,
    easing : 'out'
  }, function (frame) {
    if (frame.state.playState === 'finished') {
      console.log('finished');
    }
  });
}
