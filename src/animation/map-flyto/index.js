var map = new maptalks.Map('map', {
  center: [-74.08087539941407, 40.636167734187026],
  zoom: 15,
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
    zoom: 13,
    pitch: 0,
    bearing: 20
  }, {
    duration: 5000
  });
  setTimeout(function () {
    map.animateTo({
      center: [-74.10704772446428, 40.66032606133018],
      zoom: 18,
      pitch: 65,
      bearing: 360
    }, {
      duration: 7000
    });
  }, 7000);
}
