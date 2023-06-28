const token = "uKYsZQZpm72WlbSgH9B7";

/**start**/
const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 14
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: `https://api.maptiler.com/tiles/v3/{z}/{x}/{y}.pbf?key=${token}`
});

const group = new maptalks.GroupGLLayer("group", [vt]).addTo(map);
/**end**/
