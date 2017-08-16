
var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var zoomControl = new maptalks.control.Zoom({
  'position'  : 'top-left',
  'slider'    : true,
  'zoomLevel' : true
}).addTo(map);

function hide() {
  zoomControl.hide();
}

function show() {
  if (zoomControl.getMap()) {
    zoomControl.show();
  } else {
    map.addControl(zoomControl);
  }
}

function remove() {
  zoomControl.remove();
}

var toolbar = new maptalks.control.Toolbar({
  position: 'top-right',
  items: [
    {
      item: 'Show',
      click: show
    },
    {
      item: 'Hide',
      click: hide
    },
    {
      item: 'Remove',
      click: remove
    }
  ]
}).addTo(map);
