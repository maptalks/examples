
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var layer = new maptalks.VectorLayer('vector').addTo(map);
var marker = new maptalks.Marker([-0.113049,51.498568]).addTo(layer);

function addListener() {
  marker.on('click', this.printEvents);
}

function removeListener() {
  marker.off('click', this.printEvents);
}

function printEvents() {
  var infoDom = document.getElementById('info');
  infoDom.innerHTML = infoDom.innerHTML + '<div>' + new Date().getTime() + ': Your click marker!</div>';
}

var toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Bind',
      click: addListener
    },
    {
      item: 'Unbind',
      click: removeListener
    }
  ]
}).addTo(map);
