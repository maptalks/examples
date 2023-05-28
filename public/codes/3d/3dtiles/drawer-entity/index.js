/**start**/
let map,
  selectedEntity = null,
  selectedMask = null;
function loadEntityPolygon() {
  fetch("{res}/geojson/house.json")
    .then((data) => {
      return data.json();
    })
    .then((data) => {
      const geometries = maptalks.GeoJSON.toGeometry(data, (geo) => {
        geo.updateSymbol({
          polygonOpacity: 0,
          lineOpacity: 0
        });
      });
      new maptalks.VectorLayer("vLayer", geometries).addTo(map);
    });
}

fetch("{res}/msd/drawer-entity/map.json")
  .then((data) => {
    return data.json();
  })
  .then((data) => {
    map = maptalks.Map.fromJSON("map", data);
    map.setCenter([121.48214966, 31.24294323]);
    const groupgllayer = map.getLayer("group");
    const gltflayer = groupgllayer.getLayer("gltf0");
    const symbol = getSymbol(1);
    const offset = getOffset(1);
    selectedEntity = new maptalks.GLTFMarker([offset.x, offset.y, 0], { symbol }).addTo(gltflayer);
    selectedEntity.hide();
    loadEntityPolygon();
    map.on("click", (e) => {
      const identifyData = groupgllayer.identify(e.coordinate)[0];
      if (identifyData) {
        const coordinate = new maptalks.Coordinate(identifyData.coordinate);
        const height = coordinate.z;
        const room = queryRoom(coordinate);
        if (!room) {
          return;
        }
        const properties = room.getProperties();
        const { floorHeight, type } = properties;
        const z = Math.floor(height / floorHeight) * floorHeight;
        const symbol = getSymbol(type);
        const offset = getOffset(type);
        selectedEntity.show();
        selectedEntity.setSymbol(symbol);
        selectedEntity.setCoordinates([offset.x, offset.y, z]);
        selectedEntity.outline();
        selectedMask = new maptalks.ClipInsideMask(room.getCoordinates(), {
          heightRange: [z, z + floorHeight]
        });
        gltflayer.setMask(selectedMask);
      }
    });
  });

function queryRoom(coordinate) {
  const polygons = map.getLayer("vLayer").getGeometries();
  for (let i = 0; i < polygons.length; i++) {
    if (polygons[i].containsPoint(coordinate)) {
      return polygons[i];
    }
  }
  return null;
}

function getSymbol(type) {
  return {
    1: {
      url: "{res}/gltf/drawer-entity/1.gltf",
      rotationZ: 20.54,
      scaleX: 0.8
    },
    2: {
      url: "{res}/gltf/drawer-entity/2.gltf",
      rotationZ: 20.54,
      scaleX: 0.6571790551008414,
      scaleY: 0.8214738188760521,
      scaleZ: 0.8214738188760521
    },
    3: {
      url: "{res}/gltf/drawer-entity/3.gltf",
      rotationZ: 20.54,
      scaleX: 0.6571790551008414,
      scaleY: 0.8214738188760521,
      scaleZ: 0.8214738188760521
    }
  }[type];
}

function getOffset(type) {
  return {
    1: {
      x: 121.48425576988325,
      y: 31.244894797942635
    },
    2: {
      x: 121.48533043050065,
      y: 31.24436843761393
    },
    3: {
      x: 121.48386542031585,
      y: 31.243875250404784
    }
  }[type];
}
/**end**/
const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "重置",
    role: "clear"
  })
  .onClick(() => {
    if (!selectedEntity) {
      return;
    }
    const offset = getOffset(1);
    selectedEntity.setCoordinates([offset.x, offset.y, 0]);
    selectedEntity.cancelOutline();
    selectedEntity.hide();
    const groupgllayer = map.getLayer("group");
    const gltflayer = groupgllayer.getLayer("gltf0");
    gltflayer.removeMask();
  });

gui
  .add({
    type: "slider",
    label: "X轴",
    value: 0.0,
    min: -100.0,
    max: 100.0,
    step: 0.1
  })
  .onChange(function (value) {
    if (!selectedEntity) {
      return;
    }
    selectedEntity.updateSymbol({ translationX: value });
  });

gui
  .add({
    type: "slider",
    label: "Y轴",
    value: 0.0,
    min: -100.0,
    max: 100.0,
    step: 0.1
  })
  .onChange(function (value) {
    if (!selectedEntity) {
      return;
    }
    selectedEntity.updateSymbol({ translationY: value });
  });

gui
  .add({
    type: "slider",
    label: "Z轴",
    value: 0.0,
    min: -100.0,
    max: 100.0,
    step: 0.1
  })
  .onChange(function (value) {
    if (!selectedEntity) {
      return;
    }
    selectedEntity.updateSymbol({ translationZ: value });
  });
