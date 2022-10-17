const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
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

const style = {
  style: [
    {
      // Only data with building layer and Polygon type are displayed
      // Please refer to the specific description of filter:http://doc.maptalks.com/docs/style/filter/feature-filter/
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "fill",
        },
        type: "fill",
      },
      symbol: {
        polygonFill: "#577570",
        polygonOpacity: 1,
      },
    },
  ],
};
vt.setStyle(style);

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig,
});
groupLayer.addTo(map);
