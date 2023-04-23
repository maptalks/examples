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
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker1.setInfoWindow({
  content: "<div><div>工人A</div><div>电话 189xxxxxxxxx</div></div>",
});
gltfMarker1.openInfoWindow();
const gltfMarker2 = new maptalks.GLTFMarker([108.960868, 34.217922, 20], {
  symbol: {
    url: "{res}/gltf/character_x_bot/scene.gltf",
    rotationZ: -90,
    scaleX: 0.5,
    scaleY: 0.5,
    scaleZ: 0.5,
    animation: true,
    loop: true,
  },
}).addTo(gltfLayer);
gltfMarker2.setInfoWindow({
  content: "<div><div>工人B</div><div>电话 189xxxxxxxxx</div></div>",
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
    label: "工业园人定位",
    type: "select",
    value: "A",
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
