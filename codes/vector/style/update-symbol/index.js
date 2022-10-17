const map = new maptalks.Map("map", {
  center: [-74.00912099912109, 40.71107610933129],
  zoom: 16,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const style = {
  style: [
    {
      filter: ["all", ["==", "$layer", "building"], ["==", "$type", "Polygon"]],
      renderPlugin: {
        dataConfig: {
          type: "fill",
        },
        type: "fill",
      },
      symbol: {
        polygonFill: "#2e7e57",
        polygonOpacity: 1,
      },
    },
  ],
};

const vt = new maptalks.VectorTileLayer("vt", {
  urlTemplate: "http://tile.maptalks.com/test/planet-single/{z}/{x}/{y}.mvt",
  spatialReference: "preset-vt-3857",
  style,
});

const groupLayer = new maptalks.GroupGLLayer("group", [vt]);
groupLayer.addTo(map);

function update() {
  vt.updateSymbol(0, {
    polygonFill: "#f85635",
  });
}
