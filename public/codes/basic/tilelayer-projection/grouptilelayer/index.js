const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 6,
  pitch: 40,
  attribution: {
    content: " &copy; carto",
  },
  // add 2 TileLayers with a GroupTileLayer
  baseLayer: new maptalks.GroupTileLayer("base", [
    new maptalks.TileLayer("tile2", {
      urlTemplate:
        "https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    }),

    new maptalks.TileLayer("boudaries", {
      urlTemplate:
        "https://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    }),
  ]),
});
