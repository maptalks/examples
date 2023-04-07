const map = new maptalks.Map('map', {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const geo = new maptalks.GeoJSONVectorTileLayer('geo', {
  data: '{res}/geojson/area.geojson',
});

geo.on('dataload', (e) => {
  map.fitExtent(e.extent);
});

const style = {
  style: [
    {
      filter: true,
      renderPlugin: {
        dataConfig: {
          type: 'point',
        },
        sceneConfig: {
          collision: true,
          fading: false,
          depthFunc: 'always',
        },
        type: 'icon',
      },
      symbol: {
        visible: true,
        markerBloom: false,
        markerAllowOverlap: false,
        markerDx: 0,
        markerDy: 0,
        markerFile: null,
        markerFill: {
          type: 'categorical',
          property: 'name',
          default: [0.53, 0.77, 0.94, 1],
          stops: [
            ['江汉区', [0.53, 0.77, 0.94, 1]],
            ['青山区', '#ff8a00'],
          ],
        },
        markerFillOpacity: 1,
        markerHeight: {
          type: 'categorical',
          property: 'name',
          default: 20,
          stops: [
            ['江汉区', 20],
            ['青山区', 30],
          ],
        },
        markerWidth: {
          type: 'categorical',
          property: 'name',
          default: 20,
          stops: [
            ['江汉区', 20],
            ['青山区', 30],
          ],
        },
        markerHorizontalAlignment: 'middle',
        markerIgnorePlacement: false,
        markerLineColor: [0.2, 0.29, 0.39, 1],
        markerLineDasharray: [0, 0, 0, 0],
        markerLineOpacity: 1,
        markerLineWidth: 3,
        markerOpacity: 1,
        markerPitchAlignment: 'viewport',
        markerPlacement: 'point',
        markerRotationAlignment: 'viewport',
        markerSpacing: 0,
        markerType: {
          type: 'categorical',
          property: 'name',
          default: 'ellipse',
          stops: [
            ['江汉区', 'ellipse'],
            ['青山区', 'pin'],
          ],
        },
        markerVerticalAlignment: 'middle',
      },
    },
  ],
};
geo.setStyle(style);

const groupLayer = new maptalks.GroupGLLayer('group', [geo]);
groupLayer.addTo(map);
