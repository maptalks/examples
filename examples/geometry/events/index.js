
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    crossOrigin: 'anonymous',
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var marker1 = new maptalks.Marker([121.471355, 31.228344], {
  symbol: {
    markerFile: 'smile.png'
  }
}).addTo(layer).hide();

var marker2 = new maptalks.Marker([121.491355, 31.228344], {
  symbol: {
    markerFile: 'smile.png'
  }
}).addTo(layer).on('hide', function () {
  marker1.show();
});

function hideAndSeek() {
  marker2.hide();
}

var actionBar = new maptalks.control.Toolbar({
  items: [
    {
      item: 'Hide And Seek',
      click: function () {
        hideAndSeek();
      }
    }
  ]
}).addTo(map);
