const map = new maptalks.Map("map", {
  center: [108.9594, 34.2193],
  zoom: 17.8,
  pitch: 58.4,
  bearing: 0,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}"
  })
});

const geo3DTileslayer = new maptalks.Geo3DTilesLayer("3dtiles", {
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

/**start**/
const gltfLayer = new maptalks.GLTFLayer("gltf");
const groupGLLayer = new maptalks.GroupGLLayer("group", [geo3DTileslayer, gltfLayer], {
  sceneConfig: {
    postProcess: {
      enable: true,
      antialias: {
        enable: true
      }
    }
  }
}).addTo(map);

const gltfMarker1 = new maptalks.GLTFMarker([108.958438, 34.217715, 17.5], {
  symbol: {
    url: "{res}/gltf/tractor/tractor.gltf",
    rotationZ: 180,
    modelHeight: 25,
    animation: true,
    loop: true,
    uniforms: {
      roughnessFactor: 0.8,
      metallicFactor: 0.2
    }
  }
}).addTo(gltfLayer);
gltfMarker1.setInfoWindow({
  content: "播种机1"
});
gltfMarker1.openInfoWindow();

const gltfMarker2 = new maptalks.GLTFMarker([108.960868, 34.217992, 19.5], {
  symbol: {
    url: "{res}/gltf/tractor/tractor.gltf",
    rotationZ: -90,
    modelHeight: 25,
    animation: true,
    loop: true,
    uniforms: {
      roughnessFactor: 0.8,
      metallicFactor: 0.2
    }
  }
}).addTo(gltfLayer);
gltfMarker2.setInfoWindow({
  content: "播种机2",
  dx: 20
});
gltfMarker2.openInfoWindow();

const route1 = {
  path: [
    [108.958438, 34.217715, 17.5, 301000],
    [108.958403, 34.219752, 19.2, 541000]
  ]
};

const route2 = {
  path: [
    [108.96099472732544, 34.21793272780141, 20.3101, 301000],
    [108.96046160202025, 34.217917380427224, 19.65663, 541000],
    [108.96047217636101, 34.21897194236598, 22.20198, 781000]
  ]
};

const player1 = new maptalks.RoutePlayer(route1, groupGLLayer, {
  showTrail: false,
  showMarker: false,
  lineSymbol: {
    lineColor: "#ea6b48"
  }
});

const player2 = new maptalks.RoutePlayer(route2, groupGLLayer, {
  showTrail: false,
  showMarker: false,
  lineSymbol: {
    lineColor: "#dbd34b"
  }
});

player1.on("playing", (param) => {
  gltfMarker1.setCoordinates(param.coordinate);
  gltfMarker1.updateSymbol({
    rotationX: -param.pitch,
    rotationZ: param.bearing - 90
  });
});

player2.on("playing", (param) => {
  gltfMarker2.setCoordinates(param.coordinate);
  gltfMarker2.updateSymbol({
    rotationX: -param.pitch,
    rotationZ: param.bearing - 90
  });
});

function play() {
  player1.setUnitTime(30);
  player1.showRoute();
  player1.play();
  player2.setUnitTime(30);
  player2.showRoute();
  player2.play();
}

// play()
/**end**/

// play();
function positioningA() {
  const coordinates = gltfMarker1.getCoordinates();
  map.animateTo({
    center: [coordinates.x, coordinates.y],
    // bearing: 0,
    pitch: 0,
    zoom: 18
  });
}
function positioningB() {
  const coordinates = gltfMarker2.getCoordinates();
  map.animateTo({
    center: [coordinates.x, coordinates.y],
    // bearing: -90,
    pitch: 0,
    zoom: 18
  });
}

const gui = new mt.GUI();

gui
  .add({
    label: "选择车辆",
    type: "select",
    value: "1",
    options: [
      {
        label: "播种机1",
        value: "1"
      },
      {
        label: "播种机2",
        value: "2"
      }
    ]
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
    value: "#dbd34b"
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineColor: value
    });
  });

gui
  .add({
    type: "slider",
    label: "轨迹宽度",
    value: 4,
    min: 1,
    max: 10,
    step: 1
  })
  .onChange((value) => {
    lineString1.updateSymbol({
      lineWidth: value
    });
  });
