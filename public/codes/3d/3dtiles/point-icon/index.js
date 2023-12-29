const map = new maptalks.Map("map", {
  center: [108.95965, 34.2189],
  zoom: 18,
  bearing: 0,
  pitch: 45,
  lights: {
    directional: { direction: [-1, -1, -1], color: [1, 1, 1] },
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
      exposure: 1.426,
      hsv: [0, 0, 0],
      orientation: 302.553
    }
  }
});

const groupGLLayer = new maptalks.GroupGLLayer("gl", [], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0.915
    },
    postProcess: {
      enable: true
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "lit"
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [0.48235, 0.48235, 0.48235, 1],
          hsv: [0, 0, -0.532],
          roughnessFactor: 0.22,
          metallicFactor: 0.58
        }
      }
    }
  }
}).addTo(map);

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
}).addTo(groupGLLayer);
layer.once("loadtileset", (e) => {
  const extent = layer.getExtent(e.index);
  map.fitExtent(extent, 0, { animation: false });
});
/**start**/
const pointLayer = new maptalks.PointLayer("point").addTo(groupGLLayer);
function addMarker(coordinate) {
  new maptalks.Marker(coordinate, {
    symbol: {
      markerFile: "{res}/images/logo-maptalks.svg",
      markerWidth: 32,
      markerHeight: 32
    }
  }).addTo(pointLayer);
}

const gui = new mt.GUI();
gui
  .add({
    type: "button",
    label: "定点添加图标",
    role: "draw"
  })
  .onClick(() => {
    pointLayer.clear();
    const coordinate = [108.95936021, 34.219710523, 61.8];
    addMarker(coordinate);
    map.flyTo(
      {
        center: [108.96012238218702, 34.22056674324037],
        zoom: 18.4446,
        pitch: 74.2,
        bearing: 39.6
      },
      { duration: 2000 }
    );
  });
/**end**/
