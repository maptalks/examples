const token = "uKYsZQZpm72WlbSgH9B7";

/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 12,
  spatialReference: "EPSG:4326"
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: `https://api.maptiler.com/tiles/v3-4326/{z}/{x}/{y}.pbf?key=${token}`,
  tileSize: 512,
  tileSystem: [1, -1, -180, 90],
  spatialReference: "preset-maptiler-4326"
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
