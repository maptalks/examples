var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('layer').addTo(map);

var CustomTool = maptalks.MapTool.extend({
  initialize: function (options) {
    maptalks.Util.setOptions(this, options);
  },

  _getEvents: function () {
    return {
      'click': this._onClick,
      'contextmenu': this._onRighClick
    };
  },

  _onClick: function (param) {
    layer.addGeometry(new maptalks.Marker(param.coordinate));
  },

  _onRighClick: function (param) {
    layer.clear();
  }
});

var customTool = new CustomTool().addTo(map);
