var map = new maptalks.Map('map', {
  center: [-74.08087539941407, 40.636167734187026],
  zoom: 15,
  attribution: {
    content: '&copy; Google Maps'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: 'http://www.google.cn/maps/vt?pb=!1m5!1m4!1i{z}!2i{x}!3i{y}!4i256!2m3!1e0!2sm!3i342009817!3m9!2sen-US!3sCN!5e18!12m1!1e47!12m3!1e37!2m1!1ssmartmaps!4e0&token=32965'
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
