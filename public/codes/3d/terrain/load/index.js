const map = new maptalks.Map("map", {
  center: [91.18531, 29.66587],
  zoom: 14,
  pitch: 60,
  bearing: 0,
});

const targetCoord = new maptalks.Coordinate(0, 0);
const POINT0 = new maptalks.Coordinate(0, 0);
const POINT1 = new maptalks.Coordinate(0, 0);

const skinLayers = [
  new maptalks.TileLayer("base", {
    maxAvailableZoom: 20,
    spatialReference: {
      projection: "EPSG:3857",
    },
    offset: function (z) {
      const center = map.getCenter();
      const c = maptalks.CRSTransform.transform(
        center.toArray(),
        "GCJ02",
        "WGS84"
      );
      targetCoord.set(c[0], c[1]);
      const offset = map
        .coordToPoint(center, z, POINT0)
        ._sub(map.coordToPoint(targetCoord, z, POINT1));
      return offset._round().toArray();
    },
    urlTemplate:
      "http://webst{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
    subdomains: ["01", "02", "03", "04"],
    attribution:
      '&copy; <a href="http://osm.org">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/">CARTO</a>',
  }),
];

/**start**/
const terrain = {
  type: "mapbox",
  tileSize: 256,
  terrianWidth: 257,
  urlTemplate:
    "https://{s}.tiles.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=pk.eyJ1IjoibWFwYm94LWdsLWpzIiwiYSI6ImNram9ybGI1ajExYjQyeGxlemppb2pwYjIifQ.LGy5UGNIsXUZdYMvfYRiAQ",
  subdomains: ["a", "b", "c", "d"],
};
const group = new maptalks.GroupGLLayer("group", skinLayers, {
  terrain,
});
group.addTo(map);

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "显示地形",
    value: true,
  })
  .onChange((value) => {
    if (value) {
      group.setTerrain(terrain);
    } else {
      group.setTerrain(null);
    }
  });
/**end**/
