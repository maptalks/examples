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
          bottom: "{res}/hdr/923/bottom.jpg",
        },
      },
      exposure: 1,
      hsv: [0, 0, 0],
      orientation: 302.553,
    },
  },
});

const layer = new maptalks.Geo3DTilesLayer("3dtiles", {
  services: [
    {
      url: "http://resource.dvgis.cn/data/3dtiles/dayanta/tileset.json",
      ambientLight: [1, 1, 1],
      maximumScreenSpaceError: 1.0,
      pointOpacity: 0.5,
      pointSize: 3,
      heightOffset: -400,
    },
  ],
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 1,
      brightness: 1,
    },
    shadow: {
      enable: true,
      opacity: 0.5,
      color: [0, 0, 0],
    },
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
      ssr: {
        enable: true,
      },
      bloom: {
        enable: true,
      },
      outline: {
        enable: true,
      },
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

/**start**/
let excavateAnalysis = null;
const urlMap = {
  ground: "{res}/images/ground.jpg",
  brick: "{res}/images/brick.png",
};
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
  const boundary = [
    [108.95888623345706, 34.220502132776204],
    [108.9582019833017, 34.21987192350153],
    [108.95866479224173, 34.21879554904879],
    [108.95976365662978, 34.21870809810403],
    [108.96043811487289, 34.219454268264116],
    [108.96030941797153, 34.2204038033789],
  ];
  excavateAnalysis = new maptalks.ExcavateAnalysis({
    boundary,
    textureUrl: urlMap["ground"],
    height: 5,
  }).addTo(groupGLLayer);
});

const vLayer = new maptalks.VectorLayer("vector", {
  enableAltitude: true,
}).addTo(map);

let altitudes = [],
  coordinates = [],
  first = true;
const drawTool = new maptalks.DrawTool({
  mode: "LineString",
  enableAltitude: true,
  symbol: {
    lineColor: "#f00",
  },
})
  .addTo(map)
  .disable();

drawTool.on("mousemove", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push([coordinate.x, coordinate.y]);
    altitudes.push(coordinate.z);
  } else {
    coordinates[coordinates.length - 1] = [coordinate.x, coordinate.y];
    altitudes[altitudes.length - 1] = coordinate.z;
  }
  e.geometry.setProperties({
    altitude: altitudes,
  });
  e.geometry.setCoordinates(coordinates);
  first = false;
});

drawTool.on("drawvertex", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  if (first) {
    coordinates.push([coordinate.x, coordinate.y]);
    altitudes.push(coordinate.z);
    first = false;
  } else {
    coordinates[coordinates.length - 1] = [coordinate.x, coordinate.y];
    altitudes[altitudes.length - 1] = coordinate.z;
    first = true;
  }
  e.geometry.setProperties({
    altitude: altitudes,
  });
  e.geometry.setCoordinates(coordinates);
});

drawTool.on("drawstart", (e) => {
  const coordinate = getPickedCoordinate(e.coordinate);
  if (!coordinate) {
    return;
  }
  coordinates.push([coordinate.x, coordinate.y]);
  altitudes.push(coordinate.z);
  e.geometry.setProperties({
    altitude: altitudes,
  });
  e.geometry.setCoordinates(coordinates);
  first = true;
});

drawTool.on("drawend", () => {
  vLayer.clear();
  coordinates.push(coordinates[0]);
  altitudes.push(altitudes[0]);
  new maptalks.LineString(coordinates, {
    symbol: {
      lineColor: "#f00",
    },
    properties: {
      altitude: altitudes,
    },
  }).addTo(vLayer);
  excavateAnalysis.update("boundary", coordinates);
  coordinates = [];
  altitudes = [];
});

function getPickedCoordinate(coordinate) {
  const identifyData = groupGLLayer.identify(coordinate)[0];
  const pickedPoint = identifyData && identifyData.point;
  if (pickedPoint) {
    const altitude = map.pointAtResToAltitude(pickedPoint[2], map.getGLRes());
    const coordinate = map.pointAtResToCoordinate(
      new maptalks.Point(pickedPoint[0], pickedPoint[1]),
      map.getGLRes()
    );
    return new maptalks.Coordinate(coordinate.x, coordinate.y, altitude);
  } else {
    return coordinate;
  }
}

const gui = new mt.GUI();

gui
  .add({
    type: "button",
    label: "绘制范围",
    role: "draw",
  })
  .onClick(() => {
    drawTool.enable();
  });

gui
  .add({
    type: "slider",
    label: "挖方高度",
    value: 5,
    min: 1,
    max: 100,
    step: 1,
  })
  .onChange((value) => {
    excavateAnalysis.update("height", value);
  });

gui
  .add({
    type: "select",
    label: "挖方纹理",
    value: "ground",
    options: [
      {
        label: "地面",
        value: "ground",
      },
      {
        label: "砖块",
        value: "brick",
      },
    ],
  })
  .onChange((value) => {
    excavateAnalysis.update("textureUrl", urlMap[value]);
  });
/**end**/
