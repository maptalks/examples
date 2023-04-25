const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  pitch: 80,
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
const pointLayer = new maptalks.PointLayer("point");

const marker = new maptalks.Marker(map.getCenter(), {
  symbol: [
    {
      markerType: "ellipse",
      markerFill: "#fff",
      markerFillOpacity: 1,
      markerWidth: 20,
      markerHeight: 20,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#1bc8ff",
      markerFillOpacity: 0.9,
      markerWidth: 55,
      markerHeight: 55,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.8,
      markerWidth: 91,
      markerHeight: 91,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.3,
      markerWidth: 130,
      markerHeight: 130,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
    {
      markerType: "ellipse",
      markerFill: "#0096cd",
      markerFillOpacity: 0.2,
      markerWidth: 172,
      markerHeight: 172,
      markerLineWidth: 0,
      markerVerticalAlignment: "middle",
    },
  ],
}).addTo(pointLayer);
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
