var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 4,
  minZoom:1,
  maxZoom:18,
  spatialReference:{
    projection:'EPSG:4326'
  },
  baseLayer: new maptalks.TileLayer('base', {
    tileSystem : [1, -1, -180, 90],
    urlTemplate: 'https://t{s}.tianditu.gov.cn/vec_c/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&LAYER=vec&STYLE=default&TILEMATRIXSET=c&FORMAT=tiles&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}&tk=6901643c38b65f1f9770196343cf72b2',
    subdomains:['1', '2', '3', '4', '5'],
    attribution : '&copy; <a target="_blank" href="http://www.tianditu.cn">Tianditu</a>'
  })
});
