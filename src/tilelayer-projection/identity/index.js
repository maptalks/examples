var map = new maptalks.Map('map', {
  center:     [0, 0],
  zoom:  4,
  spatialReference : {
    projection : 'identity',
    resolutions : [
      32, 16, 8, 4, 2, 1
    ],
    fullExtent : {
      'top': 10000,
      'left': -10000,
      'bottom': -10000,
      'right': 10000
    }
  }
});

var soccerField = [
  // field
  new maptalks.Rectangle([-400, 260], 800, 520, {
    symbol : {
      lineWidth : 2,
      lineColor : '#fff',
      polygonFill : 'rgb(0, 129, 0)'
    }
  }),

  // halfway line
  new maptalks.LineString([[0, -260], [0, 260]], {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // center circle
  new maptalks.Circle([0, 0], 70, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // penalty arc
  new maptalks.Sector([-315, 0], 60, -60, 60, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // penalty arc
  new maptalks.Sector([315, 0], 60, 120, 240, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // penalty area
  new maptalks.Rectangle([-400, 155], 120, 310, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2,
      polygonFill : 'rgb(0, 129, 0)'
    }
  }),

  // penalty area
  new maptalks.Rectangle([400 - 120, 155], 120, 310, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2,
      polygonFill : 'rgb(0, 129, 0)'
    }
  }),

  // goal area
  new maptalks.Rectangle([-400, 68], 42, 136, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // goal area
  new maptalks.Rectangle([400 - 42, 68], 42, 136, {
    symbol : {
      lineColor : '#fff',
      lineWidth : 2
    }
  }),

  // penalty mark
  new maptalks.Marker([315, 0], {
    symbol : {
      markerType : 'ellipse',
      markerWidth : 2,
      markerHeight : 2,
      markerFill : '#fff',
      markerLineColor : '#fff'
    }
  }),

  // penalty mark
  new maptalks.Marker([-315, 0], {
    symbol : {
      markerType : 'ellipse',
      markerWidth : 2,
      markerHeight : 2,
      markerFill : '#fff',
      markerLineColor : '#fff'
    }
  })
];

new maptalks.VectorLayer('field', soccerField).addTo(map);
