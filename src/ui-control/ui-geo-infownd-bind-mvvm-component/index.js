// eslint-disable-next-line no-unused-vars
var vm = new window.Vue({
  el: '#app',
  data: {
    show: false,
    count: 1,
    name: 'Hello Maptalks',
    btns: [1, 2, 3, 4, 5, 6, 7, 8, 9]
  },
  watch: {

  },
  methods: {
    add: function() {
      this.count++;
    }
  },
  mounted: function() {
    var map = this.map = new maptalks.Map(this.$refs.map, {
      center: [-0.113049, 51.498568],
      zoom: 14,
      devicePixelRatio: 2,
      baseLayer: new maptalks.TileLayer('base', {
        urlTemplate: '$(urlTemplate)',
        subdomains: $(subdomains),
        attribution: '$(attribution)'
      })
    });

    var layer = new maptalks.VectorLayer('layer').addTo(map);
    var marker = new maptalks.Marker(map.getCenter());
    marker.addTo(layer);
    marker.setInfoWindow({
      content: this.$refs['infowindow_content']
    });
    marker.openInfoWindow();

  }
});


