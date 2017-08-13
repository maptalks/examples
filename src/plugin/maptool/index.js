var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  attribution : {
    position : 'top-right',
    content : '<div class="attr">Click to add Marker, right click to clear</div>'
  }
});

class CustomTool extends maptalks.MapTool {
  onEnable() {
    this._markerLayer = new maptalks.VectorLayer('CustomTool_layer')
      .addTo(this.getMap());
  }

  onDisable() {
    if (this._markerLayer) {
      this._markerLayer.remove();
    }
  }

  getEvents() {
    return {
      'click': this._onClick,
      'contextmenu': this._onRighClick
    };
  }

  _onClick(param) {
    this._markerLayer.addGeometry(new maptalks.Marker(param.coordinate));
  }

  _onRighClick(param) {
    this._markerLayer.clear();
  }
}

var customTool = new CustomTool().addTo(map);
