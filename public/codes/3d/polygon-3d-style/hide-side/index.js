const map = new maptalks.Map("map", {
  center: [-74.01125492883818, 40.70848454559504],
  zoom: 16.2,
  bearing: -1.2,
  pitch: 70.8,
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
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt"
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10,
          topThickness: 0,
          top: true,
          side: false
        },
        sceneConfig: {}
      },
      symbol: {
        polygonOpacity: 1,
        material: {
          baseColorFactor: [1, 1, 1, 1],
          roughnessFactor: 1,
          metallicFactor: 1
        }
      }
    },
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        type: "lit",
        dataConfig: {
          type: "3d-extrusion",
          altitudeProperty: "height",
          minHeightProperty: "min_height",
          altitudeScale: 1,
          defaultAltitude: 10,
          topThickness: 0,
          top: false,
          side: true
        },
        sceneConfig: {}
      },
      symbol: {
        polygonOpacity: 0,
        material: {
          baseColorFactor: [1, 1, 1, 1],
          roughnessFactor: 1,
          metallicFactor: 1
        }
      }
    }
  ]
};
vt.setStyle(style);
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
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
