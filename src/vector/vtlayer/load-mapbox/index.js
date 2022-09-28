const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
});

const token =
  'pk.eyJ1IjoidGFuZ21pbmd5YW5nIiwiYSI6ImNqczVqZmw2eTBnOW0zem96OHN4Zm41bTgifQ.0EPVaDmwmlr8iXf9cT34Kg';

const vt = new maptalks.VectorTileLayer('vt', {
  urlTemplate: `https://api.mapbox.com/v4/mapbox.mapbox-streets-v7/{z}/{x}/{y}.vector.pbf?access_token=${token}`,
  spatialReference: 'preset-vt-3857',
});

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
