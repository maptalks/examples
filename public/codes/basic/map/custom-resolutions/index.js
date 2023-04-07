const MAX_ZOOM = 28;
const spatialReference = {
  projection: "EPSG:3857",
  resolutions: (function () {
    const resolutions = [];
    const d = 2 * 6378137 * Math.PI;
    for (let i = 0; i < MAX_ZOOM; i++) {
      resolutions[i] = d / (256 * Math.pow(2, i));
    }
    return resolutions;
  })(),
  fullExtent: {
    top: 6378137 * Math.PI,
    left: -6378137 * Math.PI,
    bottom: -6378137 * Math.PI,
    right: 6378137 * Math.PI,
  },
};

const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  spatialReference: spatialReference,
  baseLayer: new maptalks.TileLayer("base", {
    maxAvailableZoom: 20,
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
});
