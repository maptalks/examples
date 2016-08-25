
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var layer = new maptalks.VectorLayer('vector').addTo(map);

var rect1 = new maptalks.Rectangle(
  map.getCenter().substract(0.03, 0), 600, 600,
  {
    symbol:{
      'polygonFill' : {
        type : 'linear',
        colorStops : [
          [0.00, '#fff'],
          [0.50, '#fff27e'],
          [1, '#f87e4b']
        ]
      },
      'polygonOpacity' : 1,
      'lineColor' : '#fff'
    }
  }
).addTo(layer);

var rect2 = new maptalks.Rectangle(
  map.getCenter().substract(0.02, 0), 600, 600,
  {
    symbol:{
      'polygonFill' : {
        type : 'linear',
        places : [0, 0, 1, 1],
        colorStops : [
          [0.00, '#fff'],
          [0.50, '#fff27e'],
          [1, '#f87e4b']
        ]
      },
      'polygonOpacity' : 1,
      'lineColor' : '#fff'
    }
  }
).addTo(layer);

var rect3 = new maptalks.Rectangle(
  map.getCenter(), 600, 600,
  {
    symbol:{
      'polygonFill' : {
        type : 'radial',
        colorStops : [
          [0.00, 'rgba(216,115,149,0)'],
          [0.50, 'rgba(216,115,149,1)'],
          [1.00, 'rgba(216,115,149,1)']
        ]
      },
      'polygonOpacity' : 1,
      'lineWidth' : 0
    }
  }
).addTo(layer);

var rect4 = new maptalks.Rectangle(
  map.getCenter().add(0.01, 0), 600, 600,
{
  symbol:{
    'polygonFill' : {
      type : 'radial',
      places : [0.5, 0.5, 1, 1, 1, 0.1],
      colorStops : [
                [0.00, '#1bbc9b'],
                [0.55, 'rgb(135,196,240)'],
                [1.00, '#34495e']
      ]
    },
    'polygonOpacity' : 1,
    'lineColor' : '#fff'
  }
}).addTo(layer);
