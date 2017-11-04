var map = new maptalks.Map('map', {
  center: [-74.08087539941407, 40.636167734187026],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

changeView();

function changeView() {
  map.animateTo({
    center: [-74.08087539941407, 40.636167734187026],
    zoom: 12,
    pitch: 0,
    bearing: 10
  }, {
    duration: 5000
  });
  setTimeout(function () {
    map.animateTo({
      center: [-74.24807358056641, 40.50564314093256],
      zoom: 16,
      pitch: 0,
      bearing: 360
    }, {
      duration: 7000
    });
  }, 5120);
}
