const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
  lights: {
    directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
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
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553
    }
  }
});
/**start**/
const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      maximumScreenSpaceError: 16.0,
      heightOffset: -400
    }
  ]
});
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});
/**end**/
const center = map.getCenter();
const sceneConfig = {
  environment: {
    enable: true,
    mode: 1,
    level: 3,
    brightness: 0.489
  },
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
      taa: true,
      jitterRatio: 0.25
    },
    ssr: {
      enable: true
    },
    "scanEffect": {
      "enable": true,
      effects: [{
        center: center.add(0.001, 0),
        radius: 150,
        speed: 1.5,
        color: [0.4667, 0.8800, 0.3804]
      },{
        center: center.add(0, 0.001),
        radius: 100,
        speed: 1.8,
        color: [0.6667, 0.8800, 0.9804]
      }
    ]
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
const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig
}).addTo(map);
