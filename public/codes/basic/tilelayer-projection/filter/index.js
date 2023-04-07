const map = new maptalks.Map("map", {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom: 1,
  maxZoom: 19,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",

    // css filter
    cssFilter: "sepia(100%) invert(90%)",
  }),
});
