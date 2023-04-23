const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 17.8,
  pitch: 58.4,
  bearing: 0,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const geo3DTileslayer = new maptalks.Geo3DTilesLayer("3dtiles", {
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

const gltfLayer = new maptalks.GLTFLayer("gltf");
const gltfMarker1 = new maptalks.GLTFMarker([108.958438, 34.217715, 17.5], {
  symbol: {
    url: "{res}/gltf/tractor/tractor.gltf",
    rotationZ: 180,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker1.setInfoWindow({
  content: "播种机1",
  dy: 40,
  dx: 15,
});
gltfMarker1.openInfoWindow();
const gltfMarker2 = new maptalks.GLTFMarker([108.960868, 34.217922, 20], {
  symbol: {
    url: "{res}/gltf/tractor/tractor.gltf",
    rotationZ: -90,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker2.setInfoWindow({
  content: "播种机2",
  dy: 40,
  dx: 15,
});
gltfMarker2.openInfoWindow();

const lineLayer = new maptalks.VectorLayer("line", {
  enableAltitude: true,
}).addTo(map);
lineLayer.setZIndex(1);
const lineString1 = new maptalks.LineString(
  [
    [108.958438, 34.217715],
    [108.958403, 34.219752],
  ],
  {
    symbol: {
      lineColor: "#ea6b48",
      lineWidth: 4,
    },
    properties: {
      altitude: [17.5, 19.2],
    },
  }
).addTo(lineLayer);

const lineString2 = new maptalks.LineString(
  [
    [108.960663, 34.217777],
    [108.960459, 34.218002],
    [108.960458, 34.219029],
  ],
  {
    symbol: {
      lineColor: "#dbd34b",
      lineWidth: 4,
    },
    properties: {
      altitude: [26, 19.7, 22],
    },
  }
).addTo(lineLayer);

const sceneConfig = {
  postProcess: {
    enable: true,
    antialias: {
      enable: true,
    },
  },
};

const groupGLLayer = new maptalks.GroupGLLayer(
  "group",
  [geo3DTileslayer, gltfLayer],
  {
    sceneConfig,
  }
).addTo(map);

/**start**/
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
function play() {
  lineString1.animateShow(
    {
      duration: 100000,
      easing: "linear",
    },
    (_, c) => {
      // console.log(getPickedCoordinate(c).y);
      // gltfMarker1.setCoordinates(getPickedCoordinate(c));
    }
  );
  lineString2.animateShow(
    {
      duration: 100000,
      easing: "linear",
    },
    (_, c) => {
      console.log(getPickedCoordinate(c).y);
      // gltfMarker2.setCoordinates(getPickedCoordinate(c));
    }
  );
}
// play();
function positioningA() {
  const coordinates = gltfMarker1.getCoordinates();
  map.animateTo({
    center: [coordinates.x, coordinates.y],
    bearing: 0,
    zoom: 18,
  });
}
function positioningB() {
  const coordinates = gltfMarker2.getCoordinates();
  map.animateTo({
    center: [coordinates.x, coordinates.y],
    bearing: -90,
    zoom: 18,
  });
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    label: "选择车辆",
    type: "select",
    value: "1",
    options: [
      {
        label: "播种机1",
        value: "1",
      },
      {
        label: "播种机2",
        value: "2",
      },
    ],
  })
  .onChange((value) => {
    if (value === "1") {
      positioningA();
    } else {
      positioningB();
    }
  });

gui
  .add({
    type: "color",
    label: "轨迹颜色",
    value: "#dbd34b",
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineColor: value,
    });
  });

gui
  .add({
    type: "slider",
    label: "轨迹宽度",
    value: 4,
    min: 1,
    max: 10,
    step: 1,
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineWidth: value,
    });
  });
