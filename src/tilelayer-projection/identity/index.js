var map = new maptalks.Map('map', {
  center:     [0, 0],
  zoom:  5,
  spatialReference : {
    projection : 'identity',
    resolutions : [
      0, 1, 2, 4, 8, 16, 32
    ],
    fullExtent : {
      'top': 10000,
      'left': -10000,
      'bottom': -10000,
      'right': 10000
    }
  }
});

var base = new maptalks.VectorLayer('v').addTo(map);
base.addGeometry(new maptalks.Marker([0, 0]));
