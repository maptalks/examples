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

var polygon = new maptalks.Polygon([
  [
    [-0.131049, 51.498568],
    [-0.107049, 51.498568],
    [-0.107049, 51.493568],
    [-0.131049, 51.493568],
    [-0.131049, 51.498568]
  ]
], {
  visible : false,
  symbol: {
    'lineColor' : '#34495e',
    'lineWidth' : 2,
    'polygonFill' : 'rgb(135,196,240)',
    'polygonOpacity' : 0.6
  }
});

new maptalks.VectorLayer('vector', polygon).addTo(map);

replay();

function replay() {
  polygon.hide();
  //polygon's animateShow
  polygon.animateShow({
    duration : 1500,
    easing : 'out'
  }, function (frame) {
    if (frame.state.playState === 'finished') {
      console.log('finished');
    }
  });
}
