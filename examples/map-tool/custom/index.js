
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

  _onAdd: function () {
    console.log('_onAdd()');
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
  },

  _onEnable: function () {
    console.log('_onEnable()');
    this._saveMapState();
  },

  _onDisable: function () {
    console.log('_onDisable()');
    this._restoreMapState();
  },

  _loadResources: function (done) {
    console.log('_loadResources()');
    // 'done.call(this)' is necessary, if override '_loadResources'
    done.call(this);
  },

  _getEvents: function () {
    return {
      'click': this._onClick,
      'dblclick': this._onDoubleClick
    };
  },

  _fireEvent: function (eventName, param) {
    param = param || {};
    param.prop1 = param;
    this.fire(eventName, param);
  },

  _onClick: function (param) {
    console.log('_onClick()');
    console.log('param: ', param);
    layer.addGeometry(new maptalks.Marker(param.coordinate));
  },

  _onDoubleClick: function (param) {
    layer.clear();
  }

});

var customTool = new CustomTool().addTo(map).disable().enable();
