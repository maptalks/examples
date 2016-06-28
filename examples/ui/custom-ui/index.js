
var MyUI = maptalks.ui.UIComponent.extend({

    options :{
        'content'  : 'UI Component'
    },

    _createDOM: function(map) {
        var dom = maptalks.DomUtil.createEl('div', 'my-ui');
        dom.innerText = this.options['content'];
        this._dom = dom;
        return dom;
    }
});


var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var MyUI = new MyUI({
    'content'   : 'My customized UI.'
 });
MyUI.addTo(map).show(map.getCenter());
