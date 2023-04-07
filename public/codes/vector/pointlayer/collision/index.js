const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 16,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const pointLayer = new maptalks.PointLayer("point", {
  collision: true,
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

function openCollision() {
  pointLayer.options.sceneConfig.collision = true;
  pointLayer.getRenderer().setToRedraw();
}

function closeCollision() {
  pointLayer.options.sceneConfig.collision = false;
  pointLayer.getRenderer().setToRedraw();
}

function openFading() {
  pointLayer.options.sceneConfig.fading = true;
}

function closeFading() {
  pointLayer.options.sceneConfig.fading = false;
}

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer]);
groupLayer.addTo(map);
