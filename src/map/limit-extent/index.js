var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  centerCross : true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  }),
  layers : [
    new maptalks.VectorLayer('v')
  ]
});

var extent = map.getExtent();

// set map's max extent to map's extent at zoom 14
map.setMaxExtent(extent);

map.setZoom(map.getZoom() - 2, { animation : false });

map.getLayer('v')
  .addGeometry(
    new maptalks.Polygon(extent.toArray(), {
      // Polygon attribute of symbol has polygonOpacity、lineWidth、lineOpacity、lineDx、lineDy
      symbol : { 'polygonOpacity': 0, 'lineWidth': 5 }
    })
  );
