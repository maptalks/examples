
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});
var chartDom = document.createElement('div');
chartDom.style.cssText = 'width:650px; height:300px;';
createChart(chartDom);

function createChart(dom) {
  var myChart = echarts.init(dom);
  var option = {
    title : {
      text: '南丁格尔玫瑰图',
      x:'center'
    },
    tooltip : {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      x : 'center',
      y : 'bottom',
      data:['rose1', 'rose2', 'rose3', 'rose4', 'rose5', 'rose6', 'rose7', 'rose8']
    },
    toolbox: {
      show : true,
      feature : {
        mark : {show: true},
        dataView : {show: true, readOnly: false},
        magicType : {
          show: true,
          type: ['pie', 'funnel']
        },
        restore : {show: true},
        saveAsImage : {show: true}
      }
    },
    calculable : true,
    series : [
      {
        name:'Area mode',
        type:'pie',
        radius : [30, 110],
        center : ['50%', '50%'],
        roseType : 'area',
        data:[
                  {value:10, name:'rose1'},
                  {value:5, name:'rose2'},
                  {value:15, name:'rose3'},
                  {value:25, name:'rose4'},
                  {value:20, name:'rose5'},
                  {value:35, name:'rose6'},
                  {value:30, name:'rose7'},
                  {value:40, name:'rose8'}
        ]
      }
    ]
  };
  myChart.setOption(option);
}

var echartsUI = new maptalks.ui.UIMarker([121.485428, 31.228541], {
  'draggable'     : true,
  'content'       : chartDom
}).addTo(map).show();

