const center = [105.08052356963802, 36.04231948670001];

// set maxNativeZoom to 24
const MAX_ZOOM = 25;
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
};

const map = new maptalks.Map("map", {
  center: center,
  spatialReference,
  zoom: 4,
  baseLayer: new maptalks.TileLayer("base", {
    maxAvailableZoom: 22,
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});
