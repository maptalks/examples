
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var geoJSONs = [

        { "type": "Point", "coordinates": [121.485428, 31.228541] },
        {
            "type": "LineString",
            "coordinates": [[121.485428, 31.238541], [121.475428, 31.238541] ]
        },
        {
            "type": "Polygon",
            "coordinates": [
                [121.485428, 31.221541], [121.475428, 31.218541],  [121.475428, 31.211541], [121.485428, 31.221541]
            ]
        }
    ];
var layer = new maptalks.GeoJSONLayer('vector', geoJSONs).addTo(map);
