const options = {
  'position' : 'top-right',
  'content'  : 'My Control'
};

class MyControl extends maptalks.control.Control {
  buildOn(map) {
    var dom = maptalks.DomUtil.createEl('div', 'my-control');
    dom.innerText = this.options['content'];
    return dom;
  }
}

MyControl.mergeOptions(options);

var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  attribution: true,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var control = new MyControl({
  'content'   : 'Hello, MyControl!'
});
map.addControl(control);
