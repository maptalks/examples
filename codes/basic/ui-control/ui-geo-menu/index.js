const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector").addTo(map);
const geometry = new maptalks.Marker([-0.113049, 51.49856]).addTo(layer);
const options = {
  items: [
    {
      item: "item1",
      click: function () {
        alert("Click item1");
      },
    },
    "-",
    {
      item: "item2",
      click: function () {
        alert("Click item2");
      },
    },
  ],
};
geometry.setMenu(options).openMenu();
