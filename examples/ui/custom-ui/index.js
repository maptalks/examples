
var MyUI = maptalks.ui.UIComponent.extend({

  options :{
    'content'  : ''
  },

  buildOn: function (map) {
    var dom = document.createElement('div');
    dom.className = 'my-ui';
    dom.innerText = this.options['content'];
    return dom;
  },

  getOffset: function () {
    var size = this.getSize();
    //move anchor to center of UI
    return new maptalks.Point(-size.width / 2, -size.height / 2);
  },

  getEvents: function () {
    return {
      'zoomend' : this._flash
    };
  },

  onRemove: function () {
    if (this._flashTimeout) {
      clearTimeout(this._flashTimeout);
    }
  },

  _flash: function () {
    //flash after zooming.
    this.hide();
    var me = this;
    this._flashTimeout = setTimeout(function () {
      me.show();
    }, 200);
  }
});


var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var ui = new MyUI({
  'content'   : 'My customized UI.'
});
ui.addTo(map).show(map.getCenter());
