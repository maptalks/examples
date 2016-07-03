
var map = new maptalks.Map('map', {
  center: [121.48542888885189, 31.228541533313702],
  zoom: 14,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var barDom = document.createElement('div');
barDom.style.cssText = 'min-width: 300px; height: 300px; margin: 0 auto;';
createBar(barDom);

function createBar(dom) {
 new Highcharts.Chart({
     chart: {
          renderTo: dom,
          backgroundColor: 'rgba(255, 255, 255, 1)',
          type: 'area',
          spacingBottom: 30
      },
      title: {
          text: 'Fruit consumption *'
      },
      subtitle: {
          text: '* Jane\'s banana consumption is unknown',
          floating: true,
          align: 'right',
          verticalAlign: 'bottom',
          y: 15
      },
      legend: {
          layout: 'vertical',
          align: 'left',
          verticalAlign: 'top',
          x: 150,
          y: 100,
          floating: true,
          borderWidth: 1,
          backgroundColor: (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF'
      },
      xAxis: {
          categories: ['Apples', 'Pears', 'Oranges', 'Bananas', 'Grapes', 'Plums', 'Strawberries', 'Raspberries']
      },
      yAxis: {
          title: {
              text: 'Y-Axis'
          },
          labels: {
              formatter: function () {
                  return this.value;
              }
          }
      },
      tooltip: {
          formatter: function () {
              return '<b>' + this.series.name + '</b><br/>' +
                  this.x + ': ' + this.y;
          }
      },
      plotOptions: {
          area: {
              fillOpacity: 0.5
          }
      },
      credits: {
          enabled: false
      },
      series: [{
          name: 'John',
          data: [0, 1, 4, 4, 5, 2, 3, 7]
      }, {
          name: 'Jane',
          data: [1, 0, 3, null, 3, 1, 2, 1]
      }]
    /*chart: {
        renderTo: dom,
        backgroundColor: 'rgba(255, 255, 255, 0)',
        plotBackgroundColor: null,
        plotBorderWidth: null,
        plotShadow: false,
        type: 'pie'
    },
    tooltip: {
        pointFormat: '{series.name}: <b>{point.percentage:.1f}%</b>'
    },
    plotOptions: {
        pie: {
            allowPointSelect: true,
            cursor: 'pointer',
            dataLabels: {
                enabled: false
            },
            showInLegend: true
        }
    },
    series: [{
        name: 'Brands',
        colorByPoint: true,
        data: [{
            name: 'Microsoft Internet Explorer',
            y: 56.33
        }, {
            name: 'Chrome',
            y: 24.03,
            sliced: true,
            selected: true
        }, {
            name: 'Firefox',
            y: 10.38
        }, {
            name: 'Safari',
            y: 4.77
        }, {
            name: 'Opera',
            y: 0.91
        }, {
            name: 'Proprietary or Undetectable',
            y: 0.2
        }]
    }]*/
  });
}


var highChartsUI = new maptalks.ui.UIMarker([121.485428, 31.228541], {
  'draggable'     : true,
  'content'       : barDom
}).addTo(map).show();

