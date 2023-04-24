const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
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
  properties: {
    adcode: "110000",
    name: "北京市",
    center: [116.405285, 39.904989],
    centroid: [116.41995, 40.18994],
    childrenNum: 16,
    level: "province",
    parent: {
      adcode: 100000,
    },
    subFeatureIndex: 0,
    acroutes: [100000],
  },
  geometry: {
    type: "Point",
    coordinates: [116.405285, 39.904989],
  },
};

const layer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data,
  // convert function
  convertFn: function convert(data) {
    return {
      type: "FeatureCollection",
      features: [
        {
          type: "Feature",
          geometry: data.geometry,
          properties: data.properties,
        },
      ],
    };
  },
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
      markerFillOpacity: 1,
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
