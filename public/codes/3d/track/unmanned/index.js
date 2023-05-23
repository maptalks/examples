const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 14,
  pitch: 10,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

/**start**/
const gltfLayer = new maptalks.GLTFLayer("gltf");
const groupLayer = new maptalks.GroupGLLayer("group", [gltfLayer], {
  sceneConfig: {
    postProcess: {
      enable: true,
      antialias: {
        enable: true,
      },
    },
  },
}).addTo(map);

const marker = new maptalks.GLTFMarker(
  [108.9585062962617, 34.21792224742464, 55.36973],
  {
    symbol: {
      url: "{res}/gltf/airplane/scene.gltf",
      scaleX: 0.5,
      scaleZ: 0.5,
      scaleY: 0.5,
      rotationZ: 150,
    },
  }
).addTo(gltfLayer);

const route = {
  path: [
    [108.92712766113277, 34.231719296446016, 500, 301000],
    [108.98841077270504, 34.23335141067818, 500, 541000],
    [108.98866826477047, 34.229377512075274, 500, 781000],
    [108.92747098388668, 34.22795821712711, 500, 901000],
    [108.92747098388668, 34.22412600129431, 500, 1021000],
    [108.9878099578857, 34.22483568404786, 500, 1201000],
    [108.98763829650875, 34.22043555458956, 500, 1441000],
    [108.92755681457515, 34.219370972610335, 500, 1681000],
  ],
};

const player = new maptalks.RoutePlayer(route, groupLayer, {
  showTrail: false,
  markerSymbol: {
    markerOpacity: 0,
  },
  lineSymbol: {
    lineColor: "#ea6b48",
    lineWidth: 2,
  },
});

let follow = false;

player.on("playing", (param) => {
  marker.setCoordinates(param.coordinate);
  marker.updateSymbol({
    rotationX: -param.pitch,
    rotationZ: param.bearing - 90,
  });
  if (follow) {
    map.setView({
      center: [param.coordinate.x, param.coordinate.y],
      zoom: 16,
      pitch: 10,
    });
  }
});

function play() {
  player.setUnitTime(50);
  player.showRoute();
  player.play();
}

play();

function changeView(value) {
  if (value === "down") {
    map.animateTo({
      center: [108.9594, 34.2193],
      zoom: 14,
      pitch: 10,
    });
    follow = false;
  } else if (value === "side") {
    map.animateTo({
      center: [108.9594, 34.2193],
      zoom: 14,
      pitch: 60,
    });
    follow = false;
  } else {
    follow = true;
  }
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    label: "视角",
    type: "select",
    value: "down",
    options: [
      {
        label: "跟随视角",
        value: "follow",
      },
      {
        label: "俯视视角",
        value: "down",
      },
      {
        label: "侧面视角",
        value: "side",
      },
    ],
  })
  .onChange((value) => {
    changeView(value);
  });

// function getPickedCoordinate(coordinate) {
//   const identifyData = groupLayer.identify(coordinate)[0];
//   const pickedPoint = identifyData && identifyData.point;
//   if (pickedPoint) {
//     const altitude = map.pointAtResToAltitude(pickedPoint[2], map.getGLRes());
//     const coordinate = map.pointAtResToCoordinate(
//       new maptalks.Point(pickedPoint[0], pickedPoint[1]),
//       map.getGLRes()
//     );
//     return new maptalks.Coordinate(coordinate.x, coordinate.y, altitude);
//   } else {
//     return coordinate;
//   }
// }

// map.on("click", (e) => {
//   const coordinate = getPickedCoordinate(e.coordinate);
//   console.log(coordinate);
// });
