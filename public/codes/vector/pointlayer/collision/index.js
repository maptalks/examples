const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 16,
  pitch: 70,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1],
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png",
        },
        prefilterCubeSize: 1024,
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const pointLayer = new maptalks.PointLayer("point", {
  collision: true,
  sceneConfig: {
    fading: true,
  }
});

const center = map.getCenter();
const width = 0.055;
const height = 0.03;
const markers = [];

for (let i = 0; i <= 5000; i++) {
  const x = center.x + (Math.random() - 0.5) * width;
  const y = center.y + (Math.random() - 0.5) * height;
  markers.push(
    new maptalks.Marker([x, y], {
      symbol: {
        markerType: "ellipse",
        markerFill: "#0e595e",
        markerFillOpacity: 0.8,
        markerLineWidth: 2,
        markerLineColor: "#fff",
        markerWidth: 20,
        markerHeight: 20,
      },
    })
  );
}

pointLayer.addGeometry(markers);

function toggleCollision(value) {
  pointLayer.options.collision = value;
  map.getRenderer().setToRedraw();
}

function toggleFading(value) {
  pointLayer.options.sceneConfig.fading = value;
  map.getRenderer().setToRedraw();
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
  },
});
groupLayer.addTo(map);

const gui = new mt.GUI();
gui
  .add({
    type: "checkbox",
    label: "collision",
    value: true,
  })
  .onChange((value) => {
    toggleCollision(value);
  });

gui
  .add({
    type: "checkbox",
    label: "fading",
    value: true,
  })
  .onChange((value) => {
    toggleFading(value);
  });
