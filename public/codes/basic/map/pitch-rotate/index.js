const map = new maptalks.Map("map", {
  center: [-0.113049, 51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  }),
  layers: [new maptalks.VectorLayer("v")],
});

addMarkers();

let pitch = 0,
  d = "up",
  bearing = 0;
const paused = false;

changeView();

function changeView() {
  if (pitch > 50) {
    d = "down";
  } else if (pitch < 0) {
    d = "up";
  }
  if (d === "down") {
    pitch--;
  } else {
    pitch++;
  }
  map.setPitch(pitch);
  map.setBearing(bearing++);
  if (!paused) {
    requestAnimationFrame(changeView);
  }
}

function reset() {
  requestAnimationFrame(function () {
    paused = true;
    pitch = 0;
    bearing = 0;
    map.setPitch(0);
    map.setBearing(0);
  });
}

function addMarkers() {
  const center = map.getCenter();
  const m1 = new maptalks.Marker(center.add(-0.008, -0.008));
  const m2 = new maptalks.Marker(center.add(0.008, -0.008));
  const m3 = new maptalks.Marker(center.add(-0.008, 0.008));
  const m4 = new maptalks.Marker(center.add(0.008, 0.008));
  map.getLayer("v").addGeometry(m1, m2, m3, m4);
}

const toolbar = new maptalks.control.Toolbar({
  items: [
    {
      item: "pause",
      click: function () {
        paused = true;
      },
    },
    {
      item: "start",
      click: function () {
        paused = false;
        changeView();
      },
    },
    {
      item: "reset",
      click: function () {
        reset();
      },
    },
  ],
}).addTo(map);
