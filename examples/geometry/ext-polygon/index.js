
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var fill = 'DimGray';

var circle = new maptalks.Circle([121.487562, 31.236812], 500, {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: '#1bbc9b',
    polygonOpacity: 0.4
  },
  properties: {
    name: 'a circle'
  }
});
var ellipse = new maptalks.Ellipse([121.488532, 31.223344], 1000, 600, {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: 'rgb(216,115,149)',
    polygonOpacity: 0.4
  },
  properties: {
    name: 'an ellipse'
  }
});
var sector = new maptalks.Sector([121.472345, 31.226732], 900, 240, 300, {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: 'rgb(135,196,240)',
    polygonOpacity: 0.4
  },
  properties: {
    name: 'a sector'
  }
});
var rectangle = new maptalks.Rectangle([121.469332, 31.240102], 800, 700, {
  symbol: {
    lineColor: '#34495e',
    lineWidth: 2,
    polygonFill: '#34495e',
    polygonOpacity: 0.4
  }
});

var layer = new maptalks.VectorLayer('vector')
    .addGeometry([circle, ellipse, sector, rectangle])
    .addTo(map);
