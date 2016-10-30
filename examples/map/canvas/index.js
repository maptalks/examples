
// var map = new maptalks.Map('map', {
//   center: [121.48542888885189, 31.228541533313702],
//   zoom: 14,
//   baseLayer: new maptalks.TileLayer('base', {
//     // urlTemplate: '$(urlTemplate)',
//     // subdomains: $(subdomains)
//     urlTemplate:'http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
//     subdomains:[1,2,3,4]
//   })
// });

 var map = new maptalks.Map('map', {
  center: [-0.113049,51.498568],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: 'http://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
    subdomains: ["a","b","c"]
  })
});
