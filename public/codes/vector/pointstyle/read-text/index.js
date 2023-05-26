const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  pitch: 40,
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
const geoLayer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson"
});

geoLayer.on("dataload", (e) => {
  map.fitExtent(e.extent);
});

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "fill"
        },
        type: "fill"
      },
      symbol: {
        polygonFill: "#234"
      }
    },
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: "line"
        },
        type: "line"
      },
      symbol: {
        lineColor: "#fff"
      }
    },
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
        type: "text"
      },
      symbol: {
        textName: "{name}",
        textFaceName: "Microsoft YaHei,sans-serif",
        textFill: "#fff",
        textHaloFill: [1, 1, 1, 1],
        textHaloOpacity: 1,
        textHaloRadius: 0,
        textSize: 16
      }
    }
  ]
};
geoLayer.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [geoLayer], {
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
