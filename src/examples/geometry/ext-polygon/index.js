var center = new maptalks.Coordinate(-0.113049,51.498568);
var map = new maptalks.Map('map', {
  center: center,
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var fill = 'DimGray';
var circle = new maptalks.Circle(center.add(0.002,0.008).toArray(),
  500, {
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
var ellipse = new maptalks.Ellipse(center.add(0.003,-0.005).toArray(),
  1000, 600, {
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
var sector = new maptalks.Sector(center.add(-0.013,-0.002).toArray(),
 900, 240, 300, {
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
var rectangle = new maptalks.Rectangle(center.add(-0.016,0.012).toArray(),
  800, 700, {
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
