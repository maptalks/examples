const map = new maptalks.Map("map", {
  center: [-73.88756247170068, 40.68791104561976],
  zoom: 17.1,
  bearing: 168.1,
  pitch: 71.2,
  lights: {
    directional: {
      direction: [0.5, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: "{res}/hdr/photo_studio_01_1k.hdr",
        sh: [
          0.35916795154960834, 0.37332532618710934, 0.3749743179025387, 0.001946880750939448,
          0.002781113205316295, 0.0038630691377190348, 0.009650859029741232, 0.010718360804091567,
          0.011421607564558255, 0.024126928868387097, 0.024543636739605402, 0.023797007154584764,
          -0.004899031092214359, -0.0048242535892225324, -0.005206229725454972,
          -0.005589141785593036, -0.005507435440934302, -0.005472906061627375,
          -0.009765483272152252, -0.010407014201306911, -0.009769691118007934, -0.081841972255034,
          -0.0852762331787664, -0.0861865957833508, -0.005844864502254523, -0.006733772922993404,
          -0.005910269638953521
        ]
      },
      exposure: 0.787,
      hsv: [0, 0, 0],
      orientation: 0
    }
  }
});

const vtStyle = [
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "fill"
      },
      sceneConfig: {},
      type: "fill"
    },
    symbol: {
      polygonBloom: false,
      polygonFill: [0.5725490196078431, 0.6980392156862745, 0.5450980392156862, 1],
      polygonOpacity: 1,
      polygonPatternFile: null
    }
  },
  {
    filter: ["all", ["==", "$layer", "entertainment"], ["==", "$type", "Polygon"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [0.73, 0.73, 0.73, 1],
      lineWidth: 2
    }
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
        top: true,
        side: true
      }
    },
    symbol: {
      material: {
        baseColorFactor: [1, 1, 1, 1],
        hsv: [0, 0, -0.32],
        baseColorIntensity: 1.532,
        roughnessFactor: 1,
        metallicFactor: 0,
        emissiveTexture: "{res}/textures/897/1.jpg",
        emissiveFactor: [0.9333333333333333, 0.9254901960784314, 0.9607843137254902],
        emitColorFactor: 0.31
      }
    }
  },
  {
    filter: ["all", ["==", "$layer", "secondary-road"], ["==", "$type", "LineString"]],
    renderPlugin: {
      dataConfig: {
        type: "line"
      },
      sceneConfig: {},
      type: "line"
    },
    symbol: {
      lineColor: [1, 1, 1, 1],
      linePatternFile: "{res}/patterns/d4b.jpg",
      lineWidth: {
        type: "exponential",
        default: 2,
        stops: [
          [14, 2],
          [15, 4],
          [16, 10],
          [17, 20],
          [18, 50],
          [20.7, 100],
          [22, 200]
        ]
      }
    }
  }
];

const vtLayer = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style: vtStyle
});

/**start**/
const gltfLayer = new maptalks.GLTFLayer("gltf");

const houseMarker = new maptalks.GLTFMarker([-73.88713688860861, 40.68848442450471], {
  id: "house",
  symbol: {
    shadow: true,
    url: "{res}/gltf/29c/scene.gltf",
    scaleX: 8.12466,
    scaleY: 8.12466,
    scaleZ: 8.12466,
    rotationZ: 299.6285,
    uniforms: {
      polygonFill: [1, 1, 1, 1],
      polygonOpacity: 1
    }
  },
  zoomOnAdded: 17
}).addTo(gltfLayer);
houseMarker.on("load", () => {
  AddSungleRoom();
});
function AddSungleRoom() {
  const position = [-73.88471481176612, 40.68931386481856, 30.991330000000016];
  const roomMarker = new maptalks.GLTFMarker(position, {
    symbol: {
      shadow: false,
      url: "{res}/gltf/room/room.gltf",
      scaleX: 1.16,
      scaleY: 1.16,
      scaleZ: 1.16,
      rotationZ: 119.6285,
      shader: "pbr",
      uniforms: {
        polygonFill: [1, 1, 1, 1],
        polygonOpacity: 1,
        baseColorIntensity: 1,
        outputSRGB: 1
      }
    },
    zoomOnAdded: 17
  }).addTo(gltfLayer);
  roomMarker.on("mouseenter mouseout", (e) => {
    if (e.type === "mouseenter") {
      e.target.setUniform("polygonFill", [0.7, 0.2, 0.3, 0.8]);
    } else {
      e.target.setUniform("polygonFill", [1, 1, 1, 1]);
    }
  });

  roomMarker.setInfoWindow({
    content: "点击箭头所指楼层",
    dy: 20
  });
  roomMarker.openInfoWindow();
}

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
    enable: true
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

const groupGLLayer = new maptalks.GroupGLLayer("gl", [vtLayer, gltfLayer], {
  sceneConfig
}).addTo(map);

map.on("click", (e) => {
  const identifyData = groupGLLayer.identify(e.coordinate)[0];
  const picked = identifyData && identifyData.data;
  if (picked && picked.getId() !== "house") {
    houseMarker.setUniform("polygonOpacity", 0.2);
  } else {
    houseMarker.setUniform("polygonOpacity", 1);
  }
});
/**end**/
