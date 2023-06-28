/**start**/
const map = new maptalks.Map("map", {
  center: [-74.01493663, 40.705559],
  zoom: 17.8,
  pitch: 43.2,
  bearing: 57.1,
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
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0
    }
  }
});

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  style: "{res}/styles/road.json"
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer], {
  sceneConfig: {
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
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [0.8039215, 0.8039215, 0.8039215, 1],
        polygonOpacity: 1
      }
    }
  }
}).addTo(map);
/**end**/
