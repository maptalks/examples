const map = new maptalks.Map('map', {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)',
  }),
});

const layer = new maptalks.PolygonLayer('polygon');

// prepare data
for (let i = 0; i < 3; i++) {
  new maptalks.Polygon(
    [
      [-0.123049 + 0.02 * i, 51.503568],
      [-0.136049 + 0.02 * i, 51.503568],
      [-0.136049 + 0.02 * i, 51.488568],
      [-0.123049 + 0.02 * i, 51.488568],
    ],
    {
      id: i,
      symbol: {
        polygonFill: 'rgb(135,196,240)',
        polygonOpacity: 1,
        lineColor: '#1bbc9b',
        lineWidth: 6,
      },
    }
  ).addTo(layer);
}

function highlightAll() {
  layer.outlineAll();
}

function highlightPart() {
  layer.outline([1, 2]);
}

function cancelhighlight() {
  layer.cancelOutline();
}

const sceneConfig = {
  // 需要先开启后处理中的outline后处理
  postProcess: {
    enable: true,
    outline: {
      enable: true,
      outlineFactor: 0.3,
      highlightFactor: 0.2,
      outlineWidth: 1,
      outlineColor: [1, 1, 0],
    },
  },
};

const groupLayer = new maptalks.GroupGLLayer('group', [layer], {
  sceneConfig,
});
groupLayer.addTo(map);
