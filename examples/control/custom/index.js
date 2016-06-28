
var myControl = maptalks.Control.extend({

  options :{
    'position' : maptalks.Control['top_right'],
    'content'  : 'My Control'
  },

  buildOn: function (map) {
    var dom = maptalks.DomUtil.createEl('div', 'my-control');
    dom.innerText = this.options['content'];
    return dom;
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

var control = new myControl({
  'position'  : {'top': '10', 'right': '10'},
  'content'   : 'My custom Control!'
});
map.addControl(control);
