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
const style = {
  style: [
    {
      //the style item name,Its value should be unique
      name: "building",
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "point"
        },
        sceneConfig: {
          collision: false,
          fading: false,
          depthFunc: "always"
        },
        type: "icon"
      },
      symbol: {
        markerFill: [0.53, 0.77, 0.94, 1],
        markerFillOpacity: 1,
        markerHeight: 20,
        markerWidth: 20,
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineWidth: 3,
        markerOpacity: 1,
        markerType: "ellipse"
      }
    }
  ]
};

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style
});

function update() {
  vt.updateSceneConfig('building', {
    collision: true
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
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      }
    }
  }
});
groupLayer.addTo(map);

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    text: "Update sceneConfig"
  })
  .onClick(() => {
    update();
  });
