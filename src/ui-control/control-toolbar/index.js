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

// horizonal one on top left
new maptalks.control.Toolbar({
  'position' : 'top-left',
  'items'     : [{
    item: 'menu',
    click : function () { info('menu'); },
    children : [{
      item: 'child 1',
      click : function () { info('child 1'); }
    }, {
      item: 'child 2',
      click : function () { info('child 2'); }
    }]
  }, {
    item: 'item 2',
    click : function () { info('item 2'); }
  }, {
    item: 'item 3',
    click : function () { info('item 3'); }
  }]
})
.addTo(map);

// horizonal one on bottom left
new maptalks.control.Toolbar({
  'position' : 'bottom-left',
  'reverseMenu' : true,
  'items'     : [{
    item: 'menu',
    click : function () { info('menu'); },
    children : [{
      item: 'child 1',
      click : function () { info('child 1'); }
    }, {
      item: 'child 2',
      click : function () { info('child 2'); }
    }]
  }, {
    item: 'item 2',
    click : function () { info('item 2'); }
  }, {
    item: 'item 3',
    click : function () { info('item 3'); }
  }]
})
.addTo(map);

// vertical one on top right
new maptalks.control.Toolbar({
  'vertical' : true,
  'position' : 'top-right',
  'items'     : [{
    item: 'menu',
    click : function () { info('menu'); },
    children : [{
      item: 'child 1',
      click : function () { info('child 1'); }
    }, {
      item: 'child 2',
      click : function () { info('child 2'); }
    }]
  }, {
    item: 'item 2',
    click : function () { info('item 2'); }
  }, {
    item: 'item 3',
    click : function () { info('item 3'); }
  }]
})
.addTo(map);

// vertical one on top left
new maptalks.control.Toolbar({
  'vertical' : true,
  'position' : { 'top' : 120, 'left' : 20 },
  'reverseMenu' : true,
  'items'     : [{
    item: 'menu',
    click : function () { info('menu'); },
    children : [{
      item: 'child 1',
      click : function () { info('child 1'); }
    }, {
      item: 'child 2',
      click : function () { info('child 2'); }
    }]
  }, {
    item: 'item 2',
    click : function () { info('item 2'); }
  }, {
    item: 'item 3',
    click : function () { info('item 3'); }
  }]
})
.addTo(map);

function info(str) {
  document.getElementById('info').innerHTML = str + ' is clicked';
}
