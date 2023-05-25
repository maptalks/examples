const map = new maptalks.Map("map", {
  center: [-74.01115777, 40.70768872],
  zoom: 16,
  bearing: -10.8,
  pitch: 63,
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
      },
      exposure: 1,
      hsv: [0, 0.34, 0],
      orientation: 0,
    },
  },
});

/**start**/
const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
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
          side: false,
        },
        sceneConfig: {
          animation: null,
          animationDuration: 800,
        },
      },
      symbol: {
        bloom: false,
        ssr: false,
        polygonOpacity: 1,
        material: {
          baseColorTexture: "{res}/textures/grass/basecolor.jpg",
          baseColorFactor: [1, 1, 1, 1],
          hsv: [0, 0, -0.021],
          baseColorIntensity: 1.585,
          contrast: 1.117,
          outputSRGB: 1,
          roughnessFactor: 1,
          metallicFactor: 0,
          normalTexture: "{res}/textures/grass/normalOgl.jpg",
          noiseTexture: null,
          uvScale: [0.93, 0.93],
          uvOffsetAnim: [0, 0],
          normalMapFactor: 0.2,
          clearCoatThickness: 5,
          clearCoatRoughnessFactor: 0.04,
          occlusionTexture: "{res}/textures/grass/ambientocclusion.jpg",
        },
        visible: true,
      },
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
          side: true,
          sideVerticalUVMode: 0,
        },
        sceneConfig: {
          animation: null,
          animationDuration: 800,
        },
      },
      symbol: {
        bloom: false,
        ssr: false,
        polygonOpacity: 1,
        material: {
          baseColorTexture: "{res}/textures/polystyrene/baseColor.png",
          baseColorFactor: [1, 1, 1, 1],
          hsv: [0, 0, 0.105],
          baseColorIntensity: 1,
          contrast: 1,
          outputSRGB: 1,
          metallicRoughnessTexture: "{res}/textures/polystyrene/roughness.png",
          roughnessFactor: 0.69,
          metallicFactor: 0.16,
          uvScale: [0.84, 0.84],
          albedoPBRFactor: 1.69,
        },
        visible: true,
      },
    },
  ],
};
vt.setStyle(style);

function updateSideVerticalUVMode(value) {
  vt.updateDataConfig(1, {
    sideVerticalUVMode: value,
  });
}
/**end**/

const groupLayer = new maptalks.GroupGLLayer("group", [vt], {
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
        polygonFill: [0.3098039, 0.3098039, 0.3098039, 1],
        polygonOpacity: 1,
      },
    },
  },
});
groupLayer.addTo(map);

const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "垂直平铺",
    value: false,
  })
  .onChange((value) => {
    updateSideVerticalUVMode(value ? 1 : 0);
  });
