const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  draggable: false, //disable drag
  dragPan: false, //disable drag panning
  dragRotate: false, //disable drag rotation
  dragPitch: false, //disable drag pitch
  scrollWheelZoom: false, //disable wheel zoom
  touchZoom: false, //disable touchzoom
  doubleClickZoom: false, //disable doubleclick zoom
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});
