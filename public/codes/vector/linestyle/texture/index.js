const map = new maptalks.Map("map", {
  center: [-73.9988357045201, 40.74431649685923],
  zoom: 14.5,
  zoomControl: true,
  bearing: 28.8,
  pitch: 0,
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
        prefilterCubeSize: 1024
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const vt1 = new maptalks.VectorTileLayer("vt1", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857"
});

const style1 = {
  style: [
    {
      filter: ["all", ["==", "$layer", "provincial-highway"], ["==", "$type", "LineString"]],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        linePatternAnimSpeed: 1,
        linePatternFile: "{res}/patterns/halo.png",
        lineStrokeColor: [0.1882352, 0.1882352, 0.1882352, 1],
        lineWidth: {
          type: "exponential",
          default: 2,
          stops: [
            [13, 2],
            [14, 10],
            [16, 30],
            [17, 80]
          ]
        }
      }
    }
  ]
};
vt1.setStyle(style1);

const vt2 = new maptalks.VectorTileLayer("vt2", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857"
});

const style2 = {
  style: [
    {
      filter: ["all", ["==", "$layer", "provincial-highway"], ["==", "$type", "LineString"]],
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        sceneConfig: {},
        type: "line"
      },
      symbol: {
        lineColor: [0.4274509, 0.5333333, 0.4980392, 1],
        lineWidth: 4
      }
    }
  ]
};
vt2.setStyle(style2);
/**end**/

const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true
    }
  },
  ground: {
    enable: true,
    renderPlugin: {
      type: "fill"
    },
    symbol: {
      polygonFill: [0.3215686, 0.3215686, 0.3215686, 1]
    }
  }
};

const groupLayer = new maptalks.GroupGLLayer("group", [vt2, vt1], {
  sceneConfig
});
groupLayer.addTo(map);
