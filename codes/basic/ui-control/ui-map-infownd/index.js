const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const options = {
  title: "Map' InfoWindow",
  content: "Click on map to reopen",

  // 'autoPan': true,
  // 'width': 300,
  // 'minHeight': 120,
  // 'custom': false,
  //'autoOpenOn' : 'click',  //set to null if not to open window when clicking on map
  //'autoCloseOn' : 'click'
};
const infoWindow = new maptalks.ui.InfoWindow(options);
infoWindow.addTo(map).show();
