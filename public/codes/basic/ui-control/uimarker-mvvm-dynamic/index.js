
function randomCoordinates(map) {
  var coordinates = [];
  var center = map.getCenter();
  var x = center.x, y = center.y;
  while (coordinates.length < 5) {
    var lng = x + Math.random() - 0.5, lat = y + Math.random() * 0.6 - 0.3;
    coordinates.push([lng, lat]);
  }
  return coordinates;
}

const vm = new window.Vue({
  el: "#app",
  data: {

  },
  watch: {},
  methods: {

  },
  mounted: function () {
    const map = (this.map = new maptalks.Map(this.$refs.map, {
      center: [-0.113049, 51.498568],
      zoom: 10,
      doubleClickZoom: false,
      baseLayer: new maptalks.TileLayer("base", {
        urlTemplate: "{urlTemplate}",
        subdomains: ["a", "b", "c", "d"],
        attribution: "{attribution}",
      }),
    }));



    randomCoordinates(map).map((c, index) => {
      var Profile = Vue.extend({
        template: `<div class="profile">  
                    <input type="checkbox" v-model='checked'/><label>show btns</label><br>
                     <button @click="add">++1</button><br>
                    count:{{btns.length}}<br>
                    <button v-if="checked" v-for="item in btns">{{item}}</button>
                    
            </div>`,
        data: function () {
          return {
            count: 1,
            checked: true,
            btns: new Array(Math.ceil(Math.random() * 5)).fill(0)
          }
        },
        methods: {
          add() {
            // this.count++;
            this.btns.push(1);
          }
        }
      });
      const profile = new Profile().$mount();
      console.log(profile);
      var uiMarker = new maptalks.ui.UIMarker(c, {
        content: profile.$el,
        verticalAlignment: 'top',
        collision: true,
        collisionFadeIn: true
        // eventsPropagation: false
      });
      uiMarker.addTo(map);

    });
  },
});
