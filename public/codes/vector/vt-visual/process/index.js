const map = new maptalks.Map("map", {
  center: [-74.01, 40.704],
  zoom: 16.3,
  bearing: 24,
  pitch: 48.8,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/923/front.jpg",
          back: "{res}/hdr/923/back.jpg",
          left: "{res}/hdr/923/left.jpg",
          right: "{res}/hdr/923/right.jpg",
          top: "{res}/hdr/923/top.jpg",
          bottom: "{res}/hdr/923/bottom.jpg"
        }
      },
      exposure: 0.787
    }
  }
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/road.json"
});

/**start**/
const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 0,
    brightness: 0.489
  },
  shadow: {
    type: "esm",
    enable: true,
    quality: "high",
    opacity: 0.5,
    color: [0, 0, 0],
    blurOffset: 1
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
      polygonFill: [0.803921568627451, 0.803921568627451, 0.803921568627451, 1],
      polygonOpacity: 1
    }
  }
};

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer], {
  sceneConfig
}).addTo(map);

const mapPostProcess = {
  enable: true,
  vignette: {
    enable: false
  }
};

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "暗角",
    value: false
  })
  .onChange((value) => {
    mapPostProcess.vignette.enable = value;
    map.setPostProcessConfig(mapPostProcess);
  });
/**end**/
