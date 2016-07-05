
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var horizontal = new maptalks.control.Toolbar({
  'vertical' : false,
  'position' : 'top-left',
  'items'     : [{
    item: '<span style="color:#fff;font-size:12px;">one</span>',
    click : function () { alert('click one!'); },
    children : [{
      item: 'drop one',
      click : function () { alert('click drop one'); }
    }, {
      item: 'drop two',
      click : function () { alert('click drop two'); }
    }]
  }, {
    item: 'two',
    click : function () { alert('click two!'); }
  }, {
    item: '<span style="color:#fff;font-size:12px;">three</span>',
    click : function () { alert('click three!'); }
  }]
});
map.addControl(horizontal);

var vertical = new maptalks.control.Toolbar({
  'vertical' : true,
  'position' : 'top-right',
  'items'     : [{
    item: 'one',
    click : function () { alert('click one!'); },
    children : [{
      item: 'left one',
      click : function () { alert('click left one'); }
    }, {
      item: 'left two',
      click : function () { alert('click left two'); }
    }]
  }, {
    item: 'two',
    click : function () { alert('click two!'); }
  }, {
    item: 'three',
    click : function () { alert('click three!'); }
  }]
});
map.addControl(vertical);
