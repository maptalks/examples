const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
});

const layer = new maptalks.VectorLayer("vector", {
  forceRenderOnMoving: true,
}).addTo(map);
const marker = new maptalks.Marker(map.getCenter()).addTo(layer);

const start = map.getCenter(),
  // offset from line start to line end.
  offset = getOffset(),
  end = start.add(offset);

const arrow = new maptalks.LineString([start, end], {
  id: "arrow",
  arrowStyle: "classic",
  arrowPlacement: "vertex-last",
}).addTo(layer);

replay();

function replay() {
  marker.setCoordinates(start);
  marker.bringToFront().animate(
    {
      // animation translate distance
      translate: [offset["x"], offset["y"]],
    },
    {
      duration: 2000,
      //let map focus on the marker
      focus: true,
    }
  );
}

function getOffset() {
  const center = map.getCenter();
  const extent = map.getExtent();
  marker.setCoordinates(center);
  return extent
    .getMax()
    .sub(map.getCenter())
    .multi(1 / 2);
}
