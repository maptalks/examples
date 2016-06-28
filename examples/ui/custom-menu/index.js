
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var options = {
  'custom': true,
  'items'  : '<div class="custom_menu"><span onclick="clickItem(this);">item1</span><br/>' +
             '<span onclick="clickItem(this);">item2</span></div>'
};
map.setMenu(options).openMenu();

function clickItem(dom) {
  alert('Click ' + dom.innerText);
}
