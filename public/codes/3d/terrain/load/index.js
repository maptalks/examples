const map = new maptalks.Map("map", {
  center: [94.50812103, 29.45095163, 1469],
  zoom: 13.04598363480825,
  pitch: 0,
  bearing: 0,
});

const token =
  "pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ";

/**start**/
const skinLayers = [
  new maptalks.TileLayer("base", {
    maxAvailableZoom: 20,
    spatialReference: {
      projection: "EPSG:3857",
    },
    urlTemplate:
      "http://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    subdomains: ["01", "02", "03", "04"],
    attribution:
      '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
  }),
];

const terrain = {
  type: "mapbox",
  tileSize: 256,
  urlTemplate: `https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${token}`,
  subdomains: ["a", "b", "c", "d"],
  shader: "lit",
  material: {
    baseColorFactor: [1, 1, 1, 1],
    hsv: [0, 0, 0.105],
    baseColorIntensity: 1,
    contrast: 1,
    outputSRGB: 1,
    roughnessFactor: 0.69,
    metallicFactor: 0.16,
  },
};

const group = new maptalks.GroupGLLayer("group", [skinLayers], {
  terrain,
});
group.addTo(map);

function setTerrain(value) {
  if (value) {
    group.setTerrain(terrain);
  } else {
    group.setTerrain(null);
  }
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "显示地形",
    value: true,
  })
  .onChange((value) => {
    setTerrain(value);
  });
