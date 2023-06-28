const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 60,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png"
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt"
});

const style = [
  {
    // Only data with building layer and Polygon type are displayed
    // Please refer to the specific description of filter:http://doc.maptalks.com/docs/style/filter/feature-filter/
    filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      type: "fill"
    },
    symbol: {
      polygonFill: "#577570"
    }
  }
];
vt.setStyle(style);
/**end**/

const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0
  }
};

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig
});
groupLayer.addTo(map);
