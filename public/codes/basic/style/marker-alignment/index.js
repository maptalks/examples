const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const center = map.getCenter();

const layer = new maptalks.VectorLayer("vector").addTo(map);

const marker1 = new maptalks.Marker(center.add(0.01, 0), {
  symbol: {
    textName: "m4",
    textSize: 14,
    markerFile: "{res}/markers/m4.png",
    markerHorizontalAlignment: "middle", // left, middle(default), right
    markerVerticalAlignment: "middle", // top, middle, bottom(default)
  },
}).addTo(layer);

const marker2 = new maptalks.Marker(center.add(-0.01, 0), {
  symbol: {
    textName: "m5",
    textSize: 14,
    markerFile: "{res}/markers/m5.png",
    markerHorizontalAlignment: "middle", // left, middle(default), right
    markerVerticalAlignment: "middle", // top, middle, bottom(default)
  },
}).addTo(layer);
