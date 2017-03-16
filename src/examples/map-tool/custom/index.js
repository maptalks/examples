var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var CustomTool = maptalks.MapTool.extend({
  initialize: function () {
  },

  onEnable: function () {
    this._markerLayer = new maptalks.VectorLayer(maptalks.internalLayerPrefix + '_marker_map_tool')
      .addTo(this.getMap());
  },

  getEvents: function () {
    return {
      'click': this._onClick,
      'contextmenu': this._onRighClick
    };
  },

  onDisable: function () {
    if (this._markerLayer) {
      this.getMap().removeLayer(this._markerLayer);
    }
  },

  _onClick: function (param) {
    this._markerLayer.addGeometry(new maptalks.Marker(param.coordinate));
  },

  _onRighClick: function (param) {
    this._markerLayer.clear();
  }
});

var customTool = new CustomTool().addTo(map);
