var map = new maptalks.Map('map', {
  center: [-0.113049,51.49856],
  zoom: 14,
  attribution: {
    content: '$(attribution)'
  },
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains)
  })
});

var highChartsUI = new maptalks.ui.UIMarker([-0.113049, 51.49856], {
  'draggable'     : true,
  'content'       : createBar()
}).addTo(map).show();

function createBar() {
  var dom = document.createElement('div');
  dom.style.cssText = 'min-width: 300px; height: 300px; margin: 0 auto;';
  new Highcharts.Chart({
    chart: {
      renderTo: dom,
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
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
  });
  return dom;
}
