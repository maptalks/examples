const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  zoomControl: true,
  pitch: 80,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png",
        },
        prefilterCubeSize: 1024,
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const layer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson",
});

layer.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const style = {
  style: [
    {
      filter: true,
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
          // 通过 function-type 动态改变 markerHeight 和 markerWidth
          // 关于 function-type 的详细信息可以参考： http://doc.maptalks.com/docs/style/filter/function-type/
          markerHeight: {
            stops: [
              [9, 20],
              [10, 80],
            ],
          },
          markerWidth: {
            stops: [
              [9, 20],
              [10, 80],
            ],
          },
          markerFill: [0.53, 0.77, 0.94, 1],
          markerFillOpacity: 1,
          markerLineColor: [0.45882352, 0.54117647, 0.65882352, 1],
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
          textName: "{name}",
          textSize: {
            stops: [
              [9, 15],
              [10, 60],
            ],
          },
        },
      ],
    },
  ],
};
layer.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
  },
});
groupLayer.addTo(map);
