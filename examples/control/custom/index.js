var MyControl = maptalks.Control.extend({

    options :{
        'position' : maptalks.Control['top_right'],
        'content'  : 'My Control'
    },

    buildOn: function(map) {
        var dom = maptalks.DomUtil.createEl('div', 'my-control');
        dom.innerText = this.options['content'];
        this._dom = dom;
        return dom;
    }
});


var map = new maptalks.Map("map", {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("tile", {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var myControl = new MyControl({
    'position'  : {'top': '10', 'right': '10'},
    'content'   : 'My custom Control!'
 });
map.addControl(myControl);
