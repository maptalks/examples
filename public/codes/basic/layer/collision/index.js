
var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 8,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: "{urlTemplate}",
    subdomains: ["a", "b", "c", "d"],
    attribution: "{attribution}",
  })
});

var layer = new maptalks.VectorLayer('layer', {
  'collision': true,
  'collisionDelay': 250,
  'collisionScope': 'map',
  'forceRenderOnMoving': true,
  'forceRenderOnZooming': true,
  'forceRenderOnRotating': true,
  // debug:true
}).addTo(map);
var layer1 = new maptalks.VectorLayer('layer1', {
  'collision': true,
  'collisionDelay': 250,
  'collisionScope': 'map',
  'forceRenderOnMoving': true,
  'forceRenderOnZooming': true,
  'forceRenderOnRotating': true,
  // debug:true
}).addTo(map);
// layer.on('layerload', () => {
//     console.log('layerload')
// });

function randomCoordinates() {
  var coordinates = [];
  var center = map.getCenter();
  var x = center.x, y = center.y;
  while (coordinates.length < 500) {
    var lng = x + Math.random() - 0.5, lat = y + Math.random() * 0.6 - 0.3;
    coordinates.push([lng, lat]);
  }
  return coordinates;
}

function createPoints(url, layer) {
  var points = randomCoordinates().map(function (c, index) {
    var point = new maptalks.Marker(c, {
      zIndex: 2000 - index,
      symbol: {
        markerFile: url,
        markerWidth: 40,
        markerHeight: 40,
        textName: index,
        textSize: 12,
        textDy: -26,
        textFill: '#fff'
      }
    });
    return point;
  });

  layer.addGeometry(points);
}

var url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABUpJREFUaEPVWFtslEUU/s70X9rupSxlKb2AQC+BVtQGG2y9RHgyETEGXnxAfDEa1CaWhEh88BJJDCRqooga30xIow8aE33yAWIi7iYNRYVlSy+2odWk7Hbb/t1td7c7v5l212xLtzP/ZROZt/Y/5/vON+ecmbNDcGgZ3d3lyVDoBaTTjzPOm7KG0UyaFgBj00YqFad0Ogagz9C0EAuHL7mBCSeoyS5Isq3tkaymHWcu1zMA7lPCSyaBVOpCcmTkzBbgHyWfIka2BCTa28/A5eoB524rQVAmM86z2fPeGzfOWvEXPpYEzO3a9RD5/V+AsU6rxIV+RNRb2dd3nIBFs3imBSQPH+7E1NRFY2Gh0SzZuvbT0+nM8HCXH7hqBteUAB1oA/At1dffT3V1ZnjUbONxZEdGAlWAaHilZVbA9wCeE8isqQnw+5VITBnNz/d7wuF9qj7KAmaANxjwcR6YPB5QYyOwYYMql7KdEYud9Y6OnlZxUBIwB7QbwCUAK7acAgHQjh0qPKZsjERiRotEOiqAIZmjkoBZ4EMCTq4FRtu3g2pqZDzmv0ejX3nGxl6WOUoFzADVDPgTQP2aYERgLS2AzyfjMvc9kUAyEqmXXXRSAQngBAcurMdOPt9yP2iauSAl1hSNHnGPjYmDo+iSCtCBLwHIU1lTA1FOTi6anT3nHhx8064A0bwHVAJjO3cCmzermKrZJBJBTyTSZVfAJIAtSoyMge3eDbgtjUZ3UbBsdqDy2rU9dgUkAVQqCRDDVVUVqLkZIGl1SiHJ5Zp0B4Nb7QoYB9AgZSswEGMG1a99aJnBQSqV8ly/XmFLwBzwuwE8aIpYjBriVNq0yazbCntD16e8t26t21TSPOvLN7BSE69gLysDa20Fysuti5ie/s0zPPyorQzowDsA3rUSBW3cuNwPVlcs9rVndPRFWwISwNMc+MlqDKIXrI7eFIuddI+O/jdArhWDtITuAHUVwN9WBQi/pVGjqsocxPz85GI43LoRmLKVAeGsA58A6DYXQYG1poG1tQEulzIEj8c/942MvCpzkGZAACwAzRkgBKBaBljsu5l+oHRaNyKRJz2ZTL+MT0lALguWmzkfBDU0gGprZTEBnL/t6e9/X25o8lVCB64AWHc2kZEujRpeb3Ezzn92X736FBEZMizxXTkDwngW2ExAVAW4qI3LBbZ3L8DYXSaUSg3yiYmj3nhc/P5QWqYECMRpYF/ZciYs31Dk94PEo0DBomx2iEejR73j438oRZ4zMi1A+BmANgecB/CKGbIVAW/bBtqam9MymRAWF094wmFp067msyQgD2LnlhYYbM/SpHyFGcaxyoGBv6xshi0Bub44TcAHVsjhdn/mSyZft+Rrp4RWE+rLw54Y+sysgz7gshmHtWxtZyAPOgMcYsCPigE97wO+UbRd18wxAYJFB05A8oIhJlsf8J4TwQsMRwXkRIjT6bUiAV72AQedCr4kAuLATg34tchDmCN1v+I4dnI38lhzQI8BfLQK29HSyWM7XkIFd8QvAJ7I/e146ZRcQAJ4lgM/5Or0mBe4WIpslywDuUvuDgFsAKjtADL3nAAd6DWARBXwUimCd/QU6uvrC3DOj+QewcSvlsC2U6cemzlwIKYfOhTB8hh+G8AkY+y7jo4Oe2N5bkccKaFgMNhCRJ8SUaBwp6t7ewPJ/fv1haamVOH/DcOIcs57urq6btrNjJMCzhHRivf18qGhilRz88LqIA3DuM05f+t/IyAfYCgUEj83HyaiB4rsbJBzfrOzszNod+dLfow6FaAMx5ESkpGU8vs9L+BfDBB3QM16CagAAAAASUVORK5CYII=';
var url1 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAA1pJREFUaEPVmr9v01AQx+/sxikwMLC0aZDaAXAYqQRiQGoXFmYkNlqJXwsDgr3tDhIDYi0SSAjEBBJrOyKkshE7MFBU8px/AAFG9qFnmspN07yzfXbVTJH83r3v5929e3dOEAQ/zbB1g4DcmPCSBdAkhAYSqGQJxG5M8B3t6Lka67yVWhaLGmr+bp0ii24T4H2uLQ0VU/zaBuvpj3HvK3fesHGFAKZC92EW4YMCEu8gvew6/oO8ELkA9K5HCC8Q4XzehdPzNAgSzOXxRmaAiV/utGXjNwnhEhCZAMoS3wfJ44lMAJNhaw0B5qR3f9AT3bo3xV2DDdD44y4B4jLXcKFxFrxSY941jg0+QNgijkGJMTqUIsDLvXr7s8keC6ARnl0FoAWTMcnnRPgmqLevmmwyAVo660ybjEk+117gnAUjwFToLhDgqqQ4rq3Yiq70xr68HzXeCHAQ4dMXTHH8OBjv3Du8AAQfg7p3oSBA9fGfvthM54ARQtWlzz07jaBUbfSlxgGoPAPtgBx6AABQjjdyk40eqKL+2e+Qci4zI0ClNdAAiUganfjrzlmEa9zLR3Yc3VWO/6RQGi27BxglzhT/eq4xhPSgg7iNOfHPBjgIL1gxnOb0yCwPaNIqizoEesR9U8EG0F5AG1fLbimJUf/sakGzZI3tUNIZqZTeoPSmXsOWBZG0kXZ001T/D244O4TSE6UhtPjjDs60sR1miQh2FhpmNIGw4LrAm4oPyvEuZhW+U3LnndifV6jUIFpWdX+liIZcITS4YJ4UGyPN92r+ehHxhUKoCISUeFGApORgvL1DoMWu4z8ruvNiZ2BQyKi6iQDWA8eblxIv7gHDPbGpHG9GUnwpAAnEkB5CMu5zlxJZdi/dipYROqWdgb7htBekD24lHkj3EJzOKot3KwFI0mryWl6/Gmkv5hVomidyE/cXmQzdW/q7BdYsIUwS0AkkOAqIW0gQEMYKIvikxv13JmHc5yIAJ3+eaUQ1a8+v7wTgbKe63VUmoiKKVwLH3+AK3W+cGEBcs5cIaDa9kAZAgL0lMqKyw+jO1rHO/78hFPiIAPTXTzxh4yzYcA7JauyCwVgRQQAAGxI7X3oaLbCpmaaKemDYyjqd9o74m5lUZRhcOkAGLbmG/gMghmJA/4n1AQAAAABJRU5ErkJggg==';

createPoints(url, layer);
createPoints(url1, layer1);
const layers = [layer, layer1];

function updateCollision(value) {
  layers.forEach(layer => {
    layer.getGeometries().forEach(function (marker) {
      marker.options.collision = value;
    });
    layer.getRenderer().draw();
  });
}

function updatecollisionScope(value) {
  console.log(value);
  layers.forEach(layer => {
    layer.config({ collisionScope: value });
  });
}


const gui = new mt.GUI();

gui
  .add({
    type: "checkbox",
    label: "collision",
    value: true
  })
  .onChange((value) => {
    updateCollision(value);
  });

gui
  .add({
    type: "checkbox",
    label: "collisionScope=map",
    value: true
  })
  .onChange((value) => {
    updatecollisionScope(value ? 'map' : 'layer');
  });

gui
  .add({
    type: "checkbox",
    label: "sortlayer",
    value: false
  })
  .onChange((value) => {
    if (value) {
      layer1.setZIndex(1);
      layer.setZIndex(2);
    } else {
      layer1.setZIndex(2);
      layer.setZIndex(1);
    }
  });
