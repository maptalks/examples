
var map = new maptalks.Map('map', {
  center: [-0.113049, 51.498568],
  zoom: 8,
  baseLayer: new maptalks.TileLayer('base', {
    urlTemplate: '$(urlTemplate)',
    subdomains: $(subdomains),
    attribution: '$(attribution)'
  })
});

var layer = new maptalks.VectorLayer('layer', {
  'collision': true,
  'collisionDelay': 250,
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
  while (coordinates.length < 1000) {
    var lng = x + Math.random() - 0.5, lat = y + Math.random() * 0.6 - 0.3;
    coordinates.push([lng, lat]);
  }
  return coordinates;
}

var url = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABUpJREFUaEPVWFtslEUU/s70X9rupSxlKb2AQC+BVtQGG2y9RHgyETEGXnxAfDEa1CaWhEh88BJJDCRqooga30xIow8aE33yAWIi7iYNRYVlSy+2odWk7Hbb/t1td7c7v5l212xLtzP/ZROZt/Y/5/vON+ecmbNDcGgZ3d3lyVDoBaTTjzPOm7KG0UyaFgBj00YqFad0Ogagz9C0EAuHL7mBCSeoyS5Isq3tkaymHWcu1zMA7lPCSyaBVOpCcmTkzBbgHyWfIka2BCTa28/A5eoB524rQVAmM86z2fPeGzfOWvEXPpYEzO3a9RD5/V+AsU6rxIV+RNRb2dd3nIBFs3imBSQPH+7E1NRFY2Gh0SzZuvbT0+nM8HCXH7hqBteUAB1oA/At1dffT3V1ZnjUbONxZEdGAlWAaHilZVbA9wCeE8isqQnw+5VITBnNz/d7wuF9qj7KAmaANxjwcR6YPB5QYyOwYYMql7KdEYud9Y6OnlZxUBIwB7QbwCUAK7acAgHQjh0qPKZsjERiRotEOiqAIZmjkoBZ4EMCTq4FRtu3g2pqZDzmv0ejX3nGxl6WOUoFzADVDPgTQP2aYERgLS2AzyfjMvc9kUAyEqmXXXRSAQngBAcurMdOPt9yP2iauSAl1hSNHnGPjYmDo+iSCtCBLwHIU1lTA1FOTi6anT3nHhx8064A0bwHVAJjO3cCmzermKrZJBJBTyTSZVfAJIAtSoyMge3eDbgtjUZ3UbBsdqDy2rU9dgUkAVQqCRDDVVUVqLkZIGl1SiHJ5Zp0B4Nb7QoYB9AgZSswEGMG1a99aJnBQSqV8ly/XmFLwBzwuwE8aIpYjBriVNq0yazbCntD16e8t26t21TSPOvLN7BSE69gLysDa20Fysuti5ie/s0zPPyorQzowDsA3rUSBW3cuNwPVlcs9rVndPRFWwISwNMc+MlqDKIXrI7eFIuddI+O/jdArhWDtITuAHUVwN9WBQi/pVGjqsocxPz85GI43LoRmLKVAeGsA58A6DYXQYG1poG1tQEulzIEj8c/942MvCpzkGZAACwAzRkgBKBaBljsu5l+oHRaNyKRJz2ZTL+MT0lALguWmzkfBDU0gGprZTEBnL/t6e9/X25o8lVCB64AWHc2kZEujRpeb3Ezzn92X736FBEZMizxXTkDwngW2ExAVAW4qI3LBbZ3L8DYXSaUSg3yiYmj3nhc/P5QWqYECMRpYF/ZciYs31Dk94PEo0DBomx2iEejR73j438oRZ4zMi1A+BmANgecB/CKGbIVAW/bBtqam9MymRAWF094wmFp067msyQgD2LnlhYYbM/SpHyFGcaxyoGBv6xshi0Bub44TcAHVsjhdn/mSyZft+Rrp4RWE+rLw54Y+sysgz7gshmHtWxtZyAPOgMcYsCPigE97wO+UbRd18wxAYJFB05A8oIhJlsf8J4TwQsMRwXkRIjT6bUiAV72AQedCr4kAuLATg34tchDmCN1v+I4dnI38lhzQI8BfLQK29HSyWM7XkIFd8QvAJ7I/e146ZRcQAJ4lgM/5Or0mBe4WIpslywDuUvuDgFsAKjtADL3nAAd6DWARBXwUimCd/QU6uvrC3DOj+QewcSvlsC2U6cemzlwIKYfOhTB8hh+G8AkY+y7jo4Oe2N5bkccKaFgMNhCRJ8SUaBwp6t7ewPJ/fv1haamVOH/DcOIcs57urq6btrNjJMCzhHRivf18qGhilRz88LqIA3DuM05f+t/IyAfYCgUEj83HyaiB4rsbJBzfrOzszNod+dLfow6FaAMx5ESkpGU8vs9L+BfDBB3QM16CagAAAAASUVORK5CYII=';
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

function updateCollision(e) {
  layer.getGeometries().forEach(function (marker) {
    marker.options.collision = e.target.checked;
  });
  layer.getRenderer().draw();
}
document.getElementById('checkbox').addEventListener('change', updateCollision);
