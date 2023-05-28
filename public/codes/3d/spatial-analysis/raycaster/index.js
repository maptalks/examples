const map = new maptalks.Map("map", {
  center: [108.9605239272878, 34.21955775963946],
  zoom: 16.5,
  pitch: 45,
  zoomControl: true,
  lights: {
    ambient: {
      color: [1, 1, 1],
      exposure: 1,
    },
    directional: {
      color: [1, 1, 1],
      lightColorIntensity: 5000,
      direction: [0, 1, -1]
    },
  },
});

/**start**/
const center = map.getCenter();

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfmarker = new maptalks.GLTFMarker(
  new maptalks.Coordinate([center.x, center.y, 150]),
  {
    symbol: {
      url: "cube",
      shadow: true,
      scaleX: 1.5,
      scaleY: 1.5,
      scaleZ: 1.5,
    },
  }
).addTo(gltfLayer);

const eyePosition = new maptalks.Coordinate([
  center.x + 0.001,
  center.y + 0.002,
  400,
]);
const viewPosition = new maptalks.Coordinate([center.x, center.y - 0.002, 300]);
const eyeMarker = new maptalks.GLTFMarker(eyePosition, {
  symbol: {
    url: "cube",
    scaleX: 0.1,
    scaleY: 0.1,
    scaleZ: 0.1,
    uniforms: {
      polygonFill: [0.91, 0.33, 0.1686, 1]
    },
  },
}).addTo(gltfLayer);

const lineLayer = new maptalks.LineStringLayer("linelayer");
const rayLine = new maptalks.LineString([eyePosition, viewPosition], {
  symbol: {
    lineColor: "#e8542b",
    lineWidth: 3
  },
}).addTo(lineLayer);

const groupLayer = new maptalks.GroupGLLayer("group", [gltfLayer, lineLayer], {
  sceneConfig: {
    shadow: {
      enable: true,
      opacity: 0.8,
      color: [0, 0, 0],
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit",
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58,
        },
      },
    },
  },
}).addTo(map);

const vectorLayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true,
}).addTo(map);

function addTextMarker(eyePosition, viewPosition) {
  new maptalks.Marker(eyePosition, {
    symbol: {
      textFaceName: "sans-serif",
      textName: "视点",
      textSize: 24,
      textFill: "#222",
      textDx: -45
    },
    properties: {
      altitude: eyePosition.z,
    },
  }).addTo(vectorLayer);
  new maptalks.Marker(viewPosition, {
    symbol: {
      textFaceName: "sans-serif",
      textName: "目标点",
      textSize: 24,
      textFill: "#222",
      textDx: 45
    },
    properties: {
      altitude: viewPosition.z
    }
  }).addTo(vectorLayer);
}

const raycaster = new maptalks.RayCaster();

function update() {
  vectorLayer.clear();
  const eyePos = eyeMarker.getCoordinates();
  rayLine.setCoordinates([eyePos, viewPosition]);
  addTextMarker(eyePos, viewPosition);
  raycaster.setFromPoint([eyePos.x, eyePos.y, eyePos.z]);
  raycaster.setToPoint([viewPosition.x, viewPosition.y, viewPosition.z]);
  const meshes = gltfmarker.getMeshes();
  const results = raycaster.test(meshes, map);
  showResult(results);
}

function showResult(results) {
  for (let i = 0; i < results.length; i++) {
    const coordinates = results[i].coordinates;
    for (let j = 0; j < coordinates.length; j++) {
      const coord = coordinates[j].coordinate;
      new maptalks.Circle(coord, 10, {
        symbol: {
          lineColor: "#f5c23b",
          polygonFill: '#f5c23b',
          polygonOpacity: 0.5
        },
        properties: {
          altitude: coord.z,
        },
      }).addTo(vectorLayer);
    }
  }
}

const transformControl = new maptalks.TransformControl();
transformControl.addTo(map);
transformControl.on("transforming", (e) => {
  const target = transformControl.getTransformTarget();
  target.setTRS(e.translate, e.rotation, e.scale);
  update();
});
transformControl.on("positionchange", (e) => {
  const target = transformControl.getTransformTarget();
  target.setCoordinates(e.coordinate);
  update();
});

map.on("click", (e) => {
  const identifyData = groupLayer.identify(e.coordinate)[0];
  if (
    identifyData &&
    identifyData.data &&
    identifyData.data instanceof maptalks.GLTFMarker
  ) {
    transformControl.enable();
    transformControl.transform(identifyData.data);
  } else if (!transformControl.picked(e.coordinate)) {
    transformControl.disable();
  }
});

setTimeout(function () {
  map.setView({
    bearing: 82.79999999999882,
    center: [108.96419515, 34.21932322],
    pitch: 60.750000000000306,
    zoom: 16.33401583421289
  });
  update();
}, 100);
map.on('click', e => {
  const view = map.getView();
  console.log(view);
});
/**end**/
