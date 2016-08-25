
var map = new maptalks.Map('map', {
  center: [121.47542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var curve0 = new maptalks.CurveLine([
  [121.46512993,31.23672464],
  [121.45843513,31.2354770],
  [121.4542294,31.23180752],
  [121.45397194,31.2252020],
  [121.45757683,31.21991730],
  [121.46341331,31.2190364]
], {
  curveType: 0,
  symbol: getCurveSymbol('Straight')
}).addTo(layer);

var curve1 = new maptalks.CurveLine([
  [121.47512993,31.23672464],
  [121.46843513,31.2354770],
  [121.4642294,31.23180752],
  [121.46397194,31.2252020],
  [121.46757683,31.21991730],
  [121.47341331,31.2190364]
], {
  curveType: 1,
  symbol: getCurveSymbol('Arc')
}).addTo(layer);

var curve2 = new maptalks.CurveLine([
  [121.48512993,31.23672464],
  [121.47843513,31.2354770],
  [121.4742294,31.23180752],
  [121.47397194,31.2252020],
  [121.47757683,31.21991730],
  [121.48341331,31.2190364]
], {
  curveType: 2,
  symbol: getCurveSymbol('Quadratic\nBézier')
}).addTo(layer);

var curve3 = new maptalks.CurveLine([
  [121.49512993,31.23672464],
  [121.48843513,31.2354770],
  [121.4842294,31.23180752],
  [121.48397194,31.2252020],
  [121.48757683,31.21991730],
  [121.49341331,31.2190364]
], {
  curveType: 3,
  symbol: getCurveSymbol('Cubic\nBézier')
}).addTo(layer);

function getCurveSymbol(title) {
  return [
    {
      lineColor: '#34495e',
      lineWidth: 3
    },
    {
      textName : title,
      textFill : '#f00',
      textWeight : 'bold',
      textHaloColor : '#fff',
      textHaloRadius : 3,
      textSize : 20,
      textWrapCharacter : '\n'
    }
  ];
}
