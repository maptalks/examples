
var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'custom': true,
  'items'  : '<ul class="custom_menu">' +
    '<li onclick="clickItem(this);">Locate</li>' +
    '<li onclick="clickItem(this);">Mark</li>' +
    '<li onclick="clickItem(this);">Identify</li>' +
    '<li onclick="clickItem(this);">About</li>' +
    '</ul>'
};
map.setMenu(options).openMenu();

map.on('contextmenu', function (e) {
  map.openMenu(e.coordinate);
});

function clickItem(dom) {
  document.getElementById('info').innerHTML = dom.innerText + ' clicked';
}
