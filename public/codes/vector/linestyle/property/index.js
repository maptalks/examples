const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 0,
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
        type: "LineString",
        coordinates: [
          [-74.0120070560211, 40.71407695132055],
          [-74.0035741908782, 40.708742027614875],
        ],
      },
      properties: {
        color: "#ff0000",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.0220070560211, 40.71407695132055],
          [-74.0135741908782, 40.708742027614875],
        ],
      },
      properties: {
        color: "#00ff00",
      },
    },
    {
      type: "Feature",
      geometry: {
        type: "LineString",
        coordinates: [
          [-74.0320070560211, 40.71407695132055],
          [-74.0235741908782, 40.708742027614875],
        ],
      },
      properties: {
        color: "#0000ff",
      },
    },
  ],
};

const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data,
});

geo.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "line",
        },
        sceneConfig: {},
        type: "line",
      },
      symbol: {
        lineColor: {
          type: "identity",
          property: "color",
          default: "#000",
        },
        lineWidth: 4,
      },
    },
  ],
};
geo.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geo], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0,
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill",
      },
      symbol: {
        polygonFill: [0.3215686, 0.3215686, 0.3215686, 1],
      },
    },
  },
});
groupLayer.addTo(map);
