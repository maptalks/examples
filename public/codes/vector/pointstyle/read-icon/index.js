const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 80,
  lights: {
    directional: {
      direction: [1, 0, -1],
      color: [1, 1, 1]
    },
    ambient: {
      resource: {
        url: {
          front: "{res}/hdr/gradient/front.png",
          back: "{res}/hdr/gradient/back.png",
          left: "{res}/hdr/gradient/left.png",
          right: "{res}/hdr/gradient/right.png",
          top: "{res}/hdr/gradient/top.png",
          bottom: "{res}/hdr/gradient/bottom.png"
        },
        prefilterCubeSize: 32
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "point"
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: "always"
        },
        type: "icon"
      },
      symbol: {
        markerFile: "{res}/markers/{icon}",
        markerFill: [0.53, 0.77, 0.94, 1],
        markerHeight: 60,
        markerWidth: 60,
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineWidth: 3
      }
    }
  ]
};

const data = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.01138478352965, 40.71511786220489],
            [-74.01046210362853, 40.70690398234356],
            [-74.00097781255187, 40.71147460291118],
            [-74.01138478352965, 40.71511786220489]
          ]
        ]
      },
      properties: {
        icon: "square"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.03138478352965, 40.71511786220489],
            [-74.03046210362853, 40.70690398234356],
            [-74.02097781255187, 40.71147460291118],
            [-74.03138478352965, 40.71511786220489]
          ]
        ]
      },
      properties: {
        icon: "m4.png"
      }
    },
    {
      type: "Feature",
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [-74.03138478352965, 40.70511786220489],
            [-74.03046210362853, 40.69690398234356],
            [-74.02097781255187, 40.70147460291118],
            [-74.03138478352965, 40.70511786220489]
          ]
        ]
      },
      properties: {
        icon: "m5.png"
      }
    }
  ]
};

const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data,
  style
});

geo.on("dataload", (e) => {
  map.fitExtent(e.extent, 0, {
    animation: false
  });
});
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geo], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    }
  }
});
groupLayer.addTo(map);
