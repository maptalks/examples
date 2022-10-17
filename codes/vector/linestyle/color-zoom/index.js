const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 17,
  zoomControl: true,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
});

// 地图放大到18级或以上变为黄色
const style = {
  style: [
    {
      filter: [
        "all",
        ["==", "$layer", "internal-road"],
        ["==", "$type", "LineString"],
      ],
      renderPlugin: {
        dataConfig: {
          type: "line",
        },
        sceneConfig: {},
        type: "line",
      },
      symbol: {
        lineColor: {
          type: "interval",
          stops: [
            [16, [0.73, 0.73, 0.73, 1]],
            [18, [0.58, 0.52, 0.37, 1]],
          ],
        },
        lineWidth: 4,
      },
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer("group", [vt]);
groupLayer.addTo(map);
