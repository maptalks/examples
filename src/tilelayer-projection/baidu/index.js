var map = new maptalks.Map('map', {
  center: [105.08052356963802, 36.04231948670001],
  zoom: 5,
  minZoom:1,
  maxZoom:19,
  spatialReference:{
    projection : 'baidu'
  },
  baseLayer: new maptalks.TileLayer('base', {
    'urlTemplate' : 'http://online{s}.map.bdimg.com/onlinelabel/?qt=tile&x={x}&y={y}&z={z}&styles=pl&scaler=1&p=1',
    'subdomains'  : [0,1,2,3,4,5,6,7,8,9],
    'attribution' :  '&copy; <a target="_blank" href="http://map.baidu.com">Baidu</a>'
  })
});
