const map = new maptalks.Map("map", {
  center: [108.9605239272878, 34.21955775963946],
  zoom: 12,
  pitch: 45,
  lights: {
    directional: { direction: [1, -0.4, -1], color: [1, 1, 1] },
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
      exposure: 1,
      hsv: [0, 0, 0],
      orientation: 302.553
    }
  }
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",

      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400
    }
  ]
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 1,
      brightness: 1
    },
    shadow: {
      enable: true,
      opacity: 0.5,
      color: [0, 0, 0]
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      },
      ssr: {
        enable: true
      },
      bloom: {
        enable: true
      },
      outline: {
        enable: true
      }
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit"
      },
      symbol: {
        polygonOpacity: 0.6,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 0.8],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58
        }
      }
    }
  }
}).addTo(map);
const polygonLayer = new maptalks.PolygonLayer('polygonlayer').addTo(groupGLLayer);
function AddPipeLine() {
  const style = {
    style: [
      {
        filter: true,
        renderPlugin: {
          dataConfig: {
            type: "round-tube",
            radialSegments: 16,
            metric: "cm",
          },
          sceneConfig: {},
          type: "tube",
        },
        symbol: {
          lineColor: {
            type: 'identity',
            property: 'type'
          },
          lineWidth: {
            type: 'identity',
            property: 'width'
          },
          metallicFactor: 1,
          roughnessFactor: 0.3,
        },
      },
    ],
  };
  const pipeline = new maptalks.GeoJSONVectorTileLayer("vt", {
    geometryEvents: false,
    data: "{res}/geojson/pipeline.geojson",
    style,
  });
  pipeline.addTo(groupGLLayer);
}

/**start**/
const textureMap = {
  ground: "{res}/images/ground.jpg",
  brick: "{res}/images/brick.png"
};
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 1, { animation: false });
  AddPipeLine();
  currentBoundary = [
    [108.95865940298586, 34.220313399352875, 28.80102335256866],
    [108.95800903947134, 34.219513250141034, 19.39458248077016],
    [108.9590190943693, 34.218511956616425, 34.85025747659524],
    [108.96027856333137, 34.21884767081414, 11.344320208363127],
    [108.96067915752451, 34.21973628032711, 29.715621078772948],
    [108.96067997002967, 34.21974168369681, 29.741613094044347],
    [108.95865940298586, 34.220313399352875, 28.80102335256866]
  ];
  ExcavateAnalysis(currentBoundary, 0);
});

const vLayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true
}).addTo(map);

let coordinates = [], currentBoundary = null, currentBottomTexture = null, currentSideTexture = null,
  first = true;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
  enableAltitude: true,
  symbol: {
    lineColor: "#f00"
  }
})
  .addTo(map)
  .disable();

drawTool.on("mousemove", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push(coordinate);
  } else {
    coordinates[coordinates.length - 1] = coordinate;
  }
  e.geometry.setCoordinates(coordinates);
  first = false;
});

drawTool.on("drawvertex", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push(coordinate);
    first = false;
  } else {
    coordinates[coordinates.length - 1] = coordinate;
    first = true;
  }
  e.geometry.setCoordinates(coordinates);
});

drawTool.on("drawstart", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.push(coordinate);
  e.geometry.setCoordinates(coordinates);
  first = true;
});

drawTool.on("drawend", () => {
  vLayer.clear();
  coordinates.push(coordinates[0]);
  new maptalks.LineString(coordinates, {
    symbol: {
      lineColor: "#aa0",
      lineWidth: 1
    }
  }).addTo(vLayer);
  console.log(coordinates);
  ExcavateAnalysis(coordinates, 0, currentBottomTexture, currentSideTexture);
  currentBoundary = coordinates;
  coordinates = [];
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate, { orderByCamera: true })[0];
  coordinate.z = coordinate.z || 0;
  return (identifyData && identifyData.coordinate) || coordinate.toArray();
}

function ExcavateAnalysis(coordinates, height, bottomTexture, sideTexture) {
  polygonLayer.clear();
  let bottomCoords = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const coord1 = coordinates[i], coord2 = coordinates[i + 1], coord3 = [coord2[0], coord2[1], height], coord4 = [coord1[0], coord1[1], height];
    const extrudeCoordinates = [coord1, coord2, coord3, coord4, coord1];
    bottomCoords[i] = [coordinates[i][0], coordinates[i][1], height];
    new maptalks.Polygon(extrudeCoordinates, {
      symbol: {
        polygonFill: '#770',
        polygonPatternFile: sideTexture
      }
    }).addTo(polygonLayer);
  }
  const idx = coordinates.length - 1;
  bottomCoords[coordinates.length - 1] = [coordinates[idx][0], coordinates[idx][1], height];
  const p = new maptalks.Polygon(bottomCoords, {
    symbol: {
      polygonFill: '#aa0',
      polygonPatternFile: bottomTexture
    }
  }).addTo(polygonLayer);
  const mask = new maptalks.ClipInsideMask(coordinates);
  layer.setMask([mask]);
}

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    label: "绘制范围",
    role: "draw"
  })
  .onClick(() => {
    drawTool.enable();
  });

gui
  .add({
    type: "slider",
    label: "挖方高度",
    value: 5,
    min: -100,
    max: 100,
    step: 1
  })
  .onChange((value) => {
    ExcavateAnalysis(currentBoundary, value, currentBottomTexture, currentSideTexture);
  });

gui
  .add({
    type: "select",
    label: "底面纹理",
    value: 'null',
    options: [
      {
        label: '无纹理',
        value: 'null'
      },
      {
        label: "地面",
        value: "ground"
      },
      {
        label: "砖块",
        value: "brick"
      }
    ]
  })
  .onChange((value) => {
    currentBottomTexture = textureMap[value];
    ExcavateAnalysis(currentBoundary, value, currentBottomTexture, currentSideTexture);
  });

  gui
  .add({
    type: "select",
    label: "侧边纹理",
    value: 'null',
    options: [
      {
        label: '无纹理',
        value: 'null'
      },
      {
        label: "地面",
        value: "ground"
      },
      {
        label: "砖块",
        value: "brick"
      }
    ]
  })
  .onChange((value) => {
    currentSideTexture = textureMap[value];
    ExcavateAnalysis(currentBoundary, value, currentBottomTexture, currentSideTexture);
  });
/**end**/
