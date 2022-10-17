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
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "point",
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: "always",
        },
        type: "icon",
      },
      symbol: [
        {
          markerType: "ellipse",
          markerHeight: 20,
          markerWidth: 20,
          markerFill: [0.53, 0.77, 0.94, 1],
          markerFillOpacity: 1,
          markerLineColor: [
            0.4588235294117647, 0.5411764705882353, 0.6588235294117647, 1,
          ],
          markerLineDasharray: [0, 0, 0, 0],
          markerLineOpacity: 0.63,
          markerLineWidth: 11,
          markerOpacity: 1,

          textDy: -19,
          textFaceName: "Microsoft YaHei,sans-serif",
          textFill: [0, 0, 0, 1],
          textHaloFill: [1, 1, 1, 1],
          textHaloOpacity: 1,
          textHaloRadius: 1,
          textName: "MapTalks",
        },
      ],
    },
  ],
};
vt.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer("group", [vt]);
groupLayer.addTo(map);
