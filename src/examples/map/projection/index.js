
var center = [105.08052356963802, 36.04231948670001];

var map3857 = new maptalks.Map('map-3857', {
  center: center,
  zoom: 4,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  }),
  attributionControl : {
    content : '&copy; <a href="http://www.osm.org" target="_blank">OpenStreetMap</a> contributors'
  }
});

var mapBD = new maptalks.Map('map-bd09', {
  center: center,
  zoom: 4,
  minZoom:1,
  maxZoom:19,
  view:{
    projection : 'baidu'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate:'http://online{s}.map.bdimg.com/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl',
    subdomains:[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
  }),
  attributionControl : {
    content : '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
  }
});

var map4326 = new maptalks.Map('map-4326', {
  center: center,
  zoom: 4,
  minZoom:1,
  maxZoom:18,
  view:{
    projection:'EPSG:4326'
  },
  baseLayer: new maptalks.TileLayer('base', {
    tileSystem : [1, -1, -180, 90],
    crossOrigin:'Anonymous',
    urlTemplate:'http://t{s}.tianditu.com/DataServer?T=vec_c&x={x}&y={y}&l={z}',
    subdomains:['1', '2', '3', '4', '5']
  }),
  layers : [
    new maptalks.TileLayer('road', {
      crossOrigin:'Anonymous',
      urlTemplate:'http://t{s}.tianditu.com/DataServer?T=cva_c&x={x}&y={y}&l={z}',
      subdomains:['1', '2', '3', '4', '5'],
      opacity:1
    })
  ],
  attributionControl : {
    content : '&copy; <a target="_blank" href="http://www.tianditu.cn">Tianditu</a>'
  }
});
