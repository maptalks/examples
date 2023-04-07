const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
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

for (let i = 0; i <= 30; i++) {
  const x = center.x + (Math.random() - 0.5) * width;
  const y = center.y + (Math.random() - 0.5) * height;
  markers.push(
    new maptalks.Marker([x, y], {
      id: i,
      symbol: {
        markerType: "ellipse",
        markerFill: "#0e595e",
        markerFillOpacity: 0.4,
        markerLineWidth: 2,
        markerLineColor: "#fff",
        markerWidth: 70,
        markerHeight: 70,
      },
    })
  );
}

pointLayer.addGeometry(markers);

function highlightAll() {
  pointLayer.outlineAll();
}

function highlightPart() {
  pointLayer.outline([10, 11, 12, 13, 14, 15]);
}

function cancelhighlight() {
  pointLayer.cancelOutline();
}

function closeFading() {
  pointLayer.options.sceneConfig.fading = false;
}

const sceneConfig = {
  // 需要先开启后处理中的outline后处理
  postProcess: {
    enable: true,
    outline: {
      enable: true,
      outlineFactor: 0.3,
      highlightFactor: 0.2,
      outlineWidth: 1,
      outlineColor: [1, 1, 0],
    },
  },
};

const groupLayer = new maptalks.GroupGLLayer("group", [pointLayer], {
  sceneConfig,
});
groupLayer.addTo(map);
