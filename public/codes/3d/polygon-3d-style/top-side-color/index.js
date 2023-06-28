const map = new maptalks.Map("map", {
  center: [-74.01115777, 40.70768872],
  zoom: 16,
  bearing: -10.8,
  pitch: 63,
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

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10
        },
        sceneConfig: {
          animation: null,
          animationDuration: 800
        }
      },
      symbol: {
        bloom: false,
        ssr: false,
        topPolygonFill: "#6190e8",
        bottomPolygonFill: "#a7bfe8",
        polygonOpacity: 1,
        material: {
          hsv: [0, 0, -0.021],
          baseColorIntensity: 1.585,
          contrast: 1.117,
          outputSRGB: 1,
          roughnessFactor: 1,
          metallicFactor: 0
        }
      }
    }
  ]
};
vt.setStyle(style);

function updateTopPolygonFill(value) {
  vt.updateSymbol(0, {
    topPolygonFill: value
  });
}

function updateBottomPolygonFill(value) {
  vt.updateSymbol(0, {
    bottomPolygonFill: value
  });
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [0.3098039, 0.3098039, 0.3098039, 1],
        polygonOpacity: 1
      }
    }
  }
});
groupLayer.addTo(map);

const gui = new mt.GUI();

gui
  .add({
    type: "color",
    label: "顶部颜色",
    value: "#6190e8"
  })
  .onChange((value) => {
    updateTopPolygonFill(value);
  });

gui
  .add({
    type: "color",
    label: "底部颜色",
    value: "#a7bfe8"
  })
  .onChange((value) => {
    updateBottomPolygonFill(value);
  });
