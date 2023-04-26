const map = new maptalks.Map("map", {
  center: [-74.00802556779087, 40.705425627111794],
  zoom: 16,
  bearing: -28.8,
  pitch: 74.8,
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
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
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
          defaultAltitude: 10,
          topThickness: 0,
          top: true,
          side: false,
        },
        sceneConfig: {
          animation: "swing",
          animationDuration: 1404,
        },
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [1, 1, 1, 1],
          roughnessFactor: 1,
          metallicFactor: 1,
        },
      },
    },
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10,
          topThickness: 0,
          top: false,
          side: true,
        },
        sceneConfig: {
          animation: "swing",
          animationDuration: 1404,
        },
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [1, 1, 1, 1],
          roughnessFactor: 1,
          metallicFactor: 1,
        },
      },
    },
  ],
};
vtLayer.setStyle(style);

function setAnimation(value) {
  // 'swing', 'easeInQuad', 'easeOutQuad', 'easeInOutQuad', 'easeInCubic', 'easeOutCubic',
  // 'easeInOutCubic', 'easeInQuart', 'easeOutQuart', 'easeInOutQuart', 'easeInQuint',
  // 'easeOutQuint', 'easeInOutQuint', 'easeInSine', 'easeOutSine', 'easeInOutSine', 'easeInExpo',
  // 'easeOutExpo', 'easeInOutExpo', 'easeInCirc', 'easeOutCirc', 'easeInOutCirc', 'easeInElastic','easeOutElastic',
  // 'easeInOutElastic', 'easeInBack','easeOutBack','easeInOutBack','easeInBounce','easeOutBounce','easeInOutBounce'
  vtLayer.updateSceneConfig(0, {
    animation: value,
  });
  vtLayer.updateSceneConfig(1, {
    animation: value,
  });
  map.zoomIn();
}

function setAnimationDuration(value) {
  vtLayer.updateSceneConfig(0, {
    animationDuration: value,
  });
  vtLayer.updateSceneConfig(1, {
    animationDuration: value,
  });
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vtLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [0.3098039, 0.3098039, 0.3098039, 1],
        polygonOpacity: 1,
      },
    },
  },
});
groupLayer.addTo(map);

const gui = new mt.GUI();

gui
  .add({
    label: "缓动类型",
    type: "select",
    value: "swing",
    options: [
      "swing",
      "easeInQuad",
      "easeOutQuad",
      "easeInOutQuad",
      "easeInCubic",
      "easeOutCubic",
      "easeInOutCubic",
      "easeInQuart",
      "easeOutQuart",
      "easeInOutQuart",
      "easeInQuint",
      "easeOutQuint",
      "easeInOutQuint",
      "easeInSine",
      "easeOutSine",
      "easeInOutSine",
      "easeInExpo",
      "easeOutExpo",
      "easeInOutExpo",
      "easeInCirc",
      "easeOutCirc",
      "easeInOutCirc",
      "easeInElastic",
      "easeOutElastic",
      "easeInOutElastic",
      "easeInBack",
      "easeOutBack",
      "easeInOutBack",
      "easeInBounce",
      "easeOutBounce",
      "easeInOutBounce",
    ],
  })
  .onChange((value) => {
    setAnimation(value);
  });

gui
  .add({
    type: "slider",
    label: "持续时间",
    value: 1404,
    min: 0,
    max: 3000,
    step: 1,
  })
  .onChange((value) => {
    setAnimationDuration(value);
  });
