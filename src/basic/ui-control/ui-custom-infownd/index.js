const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const coordinate = map.getCenter().toFixed(3);

const options = {
  // 'autoOpenOn' : 'click',  //set to null if not to open window when clicking on map
  single: false,
  width: 183,
  height: 105,
  custom: true,
  dx: -3,
  dy: -12,
  content:
    '<div class="content">' +
    '<div class="pop_title">Custom InfoWindow</div>' +
    '<div class="pop_time">' +
    new Date().toLocaleTimeString() +
    '</div><br>' +
    '<div class="pop_dept">' +
    coordinate.x +
    '</div>' +
    '<div class="pop_dept">' +
    coordinate.y +
    '</div>' +
    '<div class="arrow"></div>' +
    '</div>',
};
const infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show(coordinate);
