const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 15,
  bearing: 157,
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
const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.1862434, 30.31784858],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.194314, 30.34644838],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.1911453, 30.33728535],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.1924787, 30.32657846],
      },
      properties: {},
    },
    {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: [120.1723801, 30.27646996],
      },
      properties: {},
    },
  ],
};

const layer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data,
});

layer.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

layer.setStyle([
  {
    filter: true,
    renderPlugin: {
      dataConfig: {
        type: "point",
      },
      sceneConfig: {
        collision: true,
        fading: false,
        depthFunc: "always",
      },
      type: "icon",
    },
    symbol: {
      markerType: "ellipse",
      markerFill: "#1bbc9b",
      markerHeight: 21,
      markerWidth: 21,
    },
  },
]);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
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
