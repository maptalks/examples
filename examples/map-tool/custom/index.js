
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

  _onEnable: function () {
    this._saveMapState();
  },

  _onDisable: function () {
    this._restoreMapState();
  },


  _getEvents: function () {
    return {
      'click': this._onClick,
      'dblclick': this._onDoubleClick
    };
  },

  _onClick: function (param) {
    console.log('_onClick()');
    console.log('param: ', param);
    layer.addGeometry(new maptalks.Marker(param.coordinate));
  },

  _onDoubleClick: function (param) {
    layer.clear();
  },

  _saveMapState: function () {
    var map = this.getMap();
    this.origDoubleClickZoom = map.options.doubleClickZoom;
    map.config({
      'doubleClickZoom': false
    });
  },

  _restoreMapState: function () {
    var map = this.getMap();
    map.config({
      'doubleClickZoom': this.origDoubleClickZoom
    });
  }

});

var customTool = new CustomTool().addTo(map);
