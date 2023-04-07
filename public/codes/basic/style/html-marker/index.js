const map = new maptalks.Map("map", {
  center: [-0.113049, 51.49856],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const marker = new maptalks.ui.UIMarker([-0.113049, 51.49856], {
  draggable: true,
  single: false,
  content: '<div class="text_marker">HTML Marker</div>',
});
marker.addTo(map).show();
