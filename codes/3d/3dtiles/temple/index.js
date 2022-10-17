const map = new maptalks.Map("map", {
  center: [120.54632697304714, 27.593883052408984],
  zoom: 18,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://data.mars3d.cn/3dtiles/qx-simiao/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1,
    },
  ],
});

layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, {
    animation: false,
  });
});

const groupLayer = new maptalks.GroupGLLayer("g", [layer]).addTo(map);
