const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
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
        prefilterCubeSize: 1024
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const geo = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson"
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
        markerFile: {
          type: "categorical",
          property: "name",
          default: "{res}/markers/5.png",
          stops: [
            ["江汉区", "{res}/markers/5.png"],
            ["青山区", "{res}/markers/6.png"]
          ]
        },
        markerFill: {
          type: "categorical",
          property: "name",
          default: [0.53, 0.77, 0.94, 1],
          stops: [
            ["江汉区", [0.53, 0.77, 0.94, 1]],
            ["青山区", "#ff8a00"]
          ]
        },
        markerFillOpacity: 1,
        markerHeight: {
          type: "categorical",
          property: "name",
          default: 20,
          stops: [
            ["江汉区", 20],
            ["青山区", 30]
          ]
        },
        markerWidth: {
          type: "categorical",
          property: "name",
          default: 20,
          stops: [
            ["江汉区", 20],
            ["青山区", 30]
          ]
        },
        markerHorizontalAlignment: "middle",
        markerIgnorePlacement: false,
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineDasharray: [0, 0, 0, 0],
        markerLineOpacity: 1,
        markerLineWidth: 3,
        markerOpacity: 1,
        markerPitchAlignment: "viewport",
        markerPlacement: "point",
        markerRotationAlignment: "viewport",
        markerSpacing: 0,
        markerVerticalAlignment: "middle"
      }
    }
  ]
};
geo.setStyle(style);
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
