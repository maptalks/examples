const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  layerSwitcherControl: {
    position: "top-right",
    // title of base layers
    baseTitle: "Base Layers",
    // title of layers
    overlayTitle: "Layers",
    // layers you don't want to manage with layer switcher
    excludeLayers: [],
    // css class of container element, maptalks-layer-switcher by default
    containerClass: "maptalks-layer-switcher",
  },
  baseLayer: new maptalks.GroupTileLayer("Base TileLayer", [
    new maptalks.TileLayer("Carto light", {
      urlTemplate:
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    }),
    new maptalks.TileLayer("Carto dark", {
      visible: false,
      urlTemplate: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c", "d"],
    }),
  ]),
});

const layer = new maptalks.VectorLayer("Vector Markers", [
  new maptalks.Marker(map.getCenter().add(0.01, 0.006)),
  new maptalks.Marker(map.getCenter().add(0.01, 0)),
  new maptalks.Marker(map.getCenter().add(0.01, -0.006)),
]);
layer.addTo(map);

const layer2 = new maptalks.VectorLayer(
  "Circle Markers",
  [
    new maptalks.Marker(map.getCenter().add(-0.01, 0.006)),
    new maptalks.Marker(map.getCenter().add(-0.01, 0)),
    new maptalks.Marker(map.getCenter().add(-0.01, -0.006)),
  ],
  {
    style: [
      {
        filter: true,
        symbol: {
          markerType: "ellipse",
          markerWidth: 20,
          markerHeight: 20,
          markerFill: "#f00",
          markerLineWidth: 2,
        },
      },
    ],
  }
);
layer2.addTo(map);
