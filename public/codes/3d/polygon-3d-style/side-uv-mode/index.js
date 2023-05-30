const map = new maptalks.Map("map", {
  center: [114.392331, 30.6652025],
  zoom: 9,
  pitch: 63,
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
        }
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0
    }
  }
});

/**start**/
const layer = new maptalks.GeoJSONVectorTileLayer("geo", {
  data: "{res}/geojson/area.geojson"
});

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeScale: 30,
          defaultAltitude: 400,
          topThickness: 0,
          top: true,
          side: false
        }
      },
      symbol: {
        material: {
          baseColorFactor: [2 / 500, 26 / 500, 84 / 500, 1],
          roughnessFactor: 1,
          metallicFactor: 0
        }
      }
    },
    {
      filter: true,
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeScale: 30,
          defaultAltitude: 400,
          topThickness: 0,
          top: false,
          side: true,
          sideVerticalUVMode: 1
        }
      },
      symbol: {
        material: {
          baseColorTexture: "{res}/textures/side_mode.jpg",
          outputSRGB: 1,
          roughnessFactor: 0.69,
          metallicFactor: 0.16,
          uvScale: [0.84, 0.84]
        }
      }
    }
  ]
};
layer.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [layer], {
  sceneConfig: {
    environment: {
      enable: true,
      mode: 1,
      level: 0,
      brightness: 0
    },
    ground: {
      enable: true,
      renderPlugin: {
        type: "fill"
      },
      symbol: {
        polygonFill: [0.3098039, 0.3098039, 0.3098039, 1],
        polygonOpacity: 1
      }
    }
  }
});
groupLayer.addTo(map);
