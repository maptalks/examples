const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  pitch: 56,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

// point with altitude
const point = new maptalks.Marker([-0.113049, 51.498568], {
  properties: {
    altitude: 400,
  },
});

// same point without altitude
const point0 = new maptalks.Marker([-0.113049, 51.498568]).updateSymbol({
  markerOpacity: 0.5,
  markerFill: "#bbb",
});

new maptalks.VectorLayer("vector", [point0, point], {
  enableAltitude: true, // enable altitude
  altitudeProperty: "altitude", // altitude property in properties, default by 'altitude'
}).addTo(map);
