const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const vt = new maptalks.VectorTileLayer('vt', {
  urlTemplate: 'http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt',
  spatialReference: 'preset-vt-3857',
});

const style = {
  style: [
    {
      filter: ['all', ['==', '$layer', 'building'], ['==', '$type', 'Polygon']],
      renderPlugin: {
        dataConfig: {
          type: 'fill',
        },
        type: 'fill',
      },
      symbol: {
        polygonFill: '#2e7e57',
        polygonOpacity: 1,
      },
    },
  ],
};
vt.setStyle(style);

function setFill() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          dataConfig: {
            type: 'fill',
          },
          type: 'fill',
        },
        symbol: {
          polygonFill: '#2e7e57',
          polygonOpacity: 1,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setLine() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          dataConfig: {
            type: 'line',
          },
          sceneConfig: {},
          type: 'line',
        },
        symbol: {
          lineWidth: 2,
          lineColor: [0.23, 0.73, 0.51, 1],
          lineDasharray: [0, 0, 0, 0],
          lineDashColor: [1, 1, 1, 0],
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setIcon() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          dataConfig: {
            type: 'point',
          },
          sceneConfig: {
            collision: true,
            fading: true,
            depthFunc: 'always',
          },
          type: 'icon',
        },
        symbol: {
          markerType: 'ellipse',
          markerFill: [0.53, 0.77, 0.94, 1],
          markerFillOpacity: 1,
          markerHeight: 20,
          markerWidth: 20,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setText() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          dataConfig: {
            type: 'point',
          },
          sceneConfig: {
            collision: true,
            fading: true,
            depthFunc: 'always',
          },
          type: 'text',
        },
        symbol: {
          textName: '{name}',
          textOpacity: 1,
          textPitchAlignment: 'viewport',
          textPlacement: 'point',
          textRotation: 0,
          textRotationAlignment: 'viewport',
          textSize: 14,
          textSpacing: 250,
          textStyle: 'normal',
          textVerticalAlignment: 'middle',
          textWeight: 'normal',
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setWater() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          type: 'water',
          dataConfig: {
            type: 'fill',
          },
        },
        symbol: {
          ssr: false,
          texWaveNormal: '1.png',
          texWavePerturbation: '1.png',
          waterBaseColor: [0.1451, 0.2588, 0.4863, 1],
          contrast: 1,
          hsv: [0, 0, 0],
          uvScale: 3,
          animation: true,
          waterSpeed: 1,
          waterDirection: 0,
        },
      },
    ],
  };
  vt.setStyle(style);
}

function setLit() {
  const style = {
    style: [
      {
        filter: [
          'all',
          ['==', '$layer', 'building'],
          ['==', '$type', 'Polygon'],
        ],
        renderPlugin: {
          type: 'lit',
          dataConfig: {
            type: '3d-extrusion',
            altitudeProperty: 'height',
            minHeightProperty: 'null',
            altitudeScale: 1,
            defaultAltitude: 10,
            topThickness: 0,
            top: true,
            side: true,
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
            baseColorTexture: null,
            baseColorFactor: [1, 1, 1, 1],
            hsv: [0, 0, 0],
            baseColorIntensity: 1,
            contrast: 1,
            outputSRGB: 1,
            metallicRoughnessTexture: null,
            roughnessFactor: 1,
            metallicFactor: 1,
            normalTexture: null,
            noiseTexture: null,
            uvScale: [1, 1],
            uvOffset: [0, 0],
            uvRotation: 0,
            uvOffsetAnim: [0, 0],
            normalMapFactor: 1,
            normalMapFlipY: 0,
            bumpTexture: null,
            bumpScale: 0.02,
            clearCoatThickness: 5,
            clearCoatFactor: 0,
            clearCoatIor: 1.4,
            clearCoatRoughnessFactor: 0.04,
            occlusionTexture: null,
            emissiveTexture: null,
            emissiveFactor: [0, 0, 0],
            emitColorFactor: 1,
            emitMultiplicative: 0,
          },
        },
      },
    ],
  };
  vt.setStyle(style);
}

const groupLayer = new maptalks.GroupGLLayer('group', [vt]);
groupLayer.addTo(map);
