var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

// /121.48542888885189, 31.228541533313702
var curve0 = new maptalks.CurveLine([
  center.add(-0.002029,0.008183).toArray(),
  center.add(-0.0269928700000008,0.00693599999999961).toArray(),
  center.add(-0.0311985999999962,0.00326652000000038).toArray(),
  center.add(-0.0314560599999965,-0.00333900000000042).toArray(),
  center.add(-0.0278511700000053,-0.00862370000000112).toArray(),
  center.add(-0.0220146899999918,-0.00950459999999964).toArray()
], {
  curveType: 0,
  symbol: getCurveSymbol('Straight')
}).addTo(layer);

var curve1 = new maptalks.CurveLine([
  center.add(-0.0102980700000046,0.0081836399999986).toArray(),
  center.add(-0.0169928699999957,0.00693599999999961).toArray(),
  center.add(-0.0211986000000053,0.00326652000000038).toArray(),
  center.add(-0.0214560600000056,-0.00333900000000042).toArray(),
  center.add(-0.0178511700000001,-0.00862370000000112).toArray(),
  center.add(-0.0120146900000009,-0.00950459999999964).toArray()
], {
  curveType: 1,
  symbol: getCurveSymbol('Arc')
}).addTo(layer);

var curve2 = new maptalks.CurveLine([
  center.add(-0.000298069999999484,0.0081836399999986).toArray(),
  center.add(-0.00699287000000481,0.00693599999999961).toArray(),
  center.add(-0.00699287000000481,0.00326652000000038).toArray(),
  center.add(-0.0114560600000004,-0.00333900000000042).toArray(),
  center.add(-0.00785116999999502,-0.00862370000000112).toArray(),
  center.add(-0.00201468999999577,-0.00950459999999964).toArray()
], {
  curveType: 2,
  symbol: getCurveSymbol('Quadratic\nBézier')
}).addTo(layer);

var curve3 = new maptalks.CurveLine([
  center.add(-0.000298069999999484,0.0081836399999986).toArray(),
  center.add(-0.00699287000000481,0.00693599999999961).toArray(),
  center.add(-0.00699287000000481,0.00326652000000038).toArray(),
  center.add(-0.0114560600000004,-0.00333900000000042).toArray(),
  center.add(-0.00785116999999502,-0.00862370000000112).toArray(),
  center.add(-0.00201468999999577,-0.00950459999999964).toArray()
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
