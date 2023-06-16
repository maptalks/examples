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
    url: "{res}/gltf/character_x_bot/scene.gltf",
    rotationZ: 180,
    modelHeight: 25,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker1.setInfoWindow({
  content: "<div><div>工人A</div><div>电话 189xxxxxxxxx</div></div>"
});
gltfMarker1.openInfoWindow();
const gltfMarker2 = new maptalks.GLTFMarker([108.960868, 34.217922, 20], {
  symbol: {
    url: "{res}/gltf/character_x_bot/scene.gltf",
    rotationZ: -90,
    modelHeight: 25,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker2.setInfoWindow({
  content: "<div><div>工人B</div><div>电话 189xxxxxxxxx</div></div>",
  dx: 20
});
gltfMarker2.openInfoWindow();

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
const route1 = {
  path: [
    [108.958438, 34.217715, 17.5, 301000],
    [108.958403, 34.219752, 19.2, 541000],
  ],
};

const route2 = {
  path: [
    [108.96099472732544, 34.21793272780141, 20.3101, 301000],
    [108.96046160202025, 34.217917380427224, 19.65663, 541000],
    [108.96047217636101, 34.21897194236598, 22.20198, 781000],
  ],
};

let flag1 = false;
let flag2 = false;

const player1 = new maptalks.RoutePlayer(route1, groupGLLayer, {
  showTrail: false,
  showMarker: false,
  lineSymbol: {
    lineColor: "#ea6b48",
  },
});

const player2 = new maptalks.RoutePlayer(route2, groupGLLayer, {
  showTrail: false,
  showMarker: false,
  lineSymbol: {
    lineColor: "#dbd34b",
  },
});

function getPitch(pitch) {
  if (pitch > 270 && pitch < 350) {
    return pitch - 270;
  } else if (pitch >= 350 || (pitch >= 0 && pitch <= 180)) {
    return map.options["maxPitch"];
  } else {
    return 0;
  }
}

player1.on("playing", (param) => {
  gltfMarker1.setCoordinates(param.coordinate);
  gltfMarker1.updateSymbol({
    rotationX: -param.pitch,
    rotationZ: param.bearing - 90,
  });
  if (flag1) {
    map.setCameraPosition({
      position: [param.coordinate.x, param.coordinate.y, param.coordinate.z],
      pitch: getPitch(param.pitch),
      bearing: -param.bearing - 90,
    });
  }
});

player2.on("playing", (param) => {
  gltfMarker2.setCoordinates(param.coordinate);
  gltfMarker2.updateSymbol({
    rotationX: -param.pitch,
    rotationZ: param.bearing - 90,
  });
  if (flag2) {
    map.setCameraPosition({
      position: [param.coordinate.x, param.coordinate.y, param.coordinate.z],
      pitch: getPitch(param.pitch),
      bearing: -param.bearing - 90,
    });
  }
});

function play() {
  player1.setUnitTime(5);
  // player1.showRoute();
  player1.play();
  player2.setUnitTime(20);
  // player2.showRoute();
  player2.play();
}

play();

function positioningA() {
  // const coordinates = gltfMarker1.getCoordinates();
  // map.animateTo({
  //   center: [coordinates.x, coordinates.y],
  //   bearing: 0,
  //   zoom: 18,
  // });
  flag1 = true;
  flag2 = false;
  gltfMarker1.openInfoWindow();
}

function positioningB() {
  // const coordinates = gltfMarker2.getCoordinates();
  // map.animateTo({
  //   center: [coordinates.x, coordinates.y],
  //   bearing: -90,
  //   zoom: 18,
  // });
  flag1 = false;
  flag2 = true;
  gltfMarker2.openInfoWindow();
}
/**end**/

const gui = new mt.GUI();

gui
  .add({
    label: "工业园人定位",
    type: "select",
    value: "",
    options: [
      {
        label: "工人A",
        value: "A",
      },
      {
        label: "工人B",
        value: "B",
      },
    ],
  })
  .onChange((value) => {
    if (value === "A") {
      positioningA();
    } else {
      positioningB();
    }
  });
