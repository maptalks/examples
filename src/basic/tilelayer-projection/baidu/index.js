var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  spatialReference:{
    projection : 'baidu'
  },
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'https://gss{s}.bdstatic.com/8bo_dTSlRsgBo1vgoIiO_jowehsv/tile/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&udt=20170927',
    'subdomains':[0, 1, 2, 3],
    'attribution' :  '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
  })
});
