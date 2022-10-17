const mapJSON = {
  version: "1.0",
  options: {
    center: { x: -0.113049, y: 51.49856800000001 },
    zoom: 13,
  },
  baseLayer: {
    type: "TileLayer",
    id: "base",
    options: {
      urlTemplate: "http://{s}.tile.osm.org/{z}/{x}/{y}.png",
      subdomains: ["a", "b", "c"],
    },
  },
  layers: [
    {
      type: "VectorLayer",
      id: "v",
      geometries: [
        {
          feature: {
            type: "Feature",
            geometry: {
              type: "Point",
              coordinates: [-0.113049, 51.498568],
            },
          },
        },
      ],
    },
  ],
};

maptalks.Map.fromJSON("map", mapJSON);

document.getElementById("json").innerHTML = JSON.stringify(mapJSON);
