You can replace tilelayer gl renderer's default fragment shader with custom one.

[Default fragment shader GLSL source](https://github.com/maptalks/maptalks.js/blob/master/src/renderer/layer/tilelayer/TileLayerGLRenderer.js#L8) is:
```c
  precision mediump float;

  uniform sampler2D u_image;
  uniform float u_opacity;

  varying vec2 v_texCoord;

  void main() {
      gl_FragColor = texture2D(u_image, v_texCoord) * u_opacity;
  }
```

Required GLSL variables: `u_image`, `u_opacity`, `v_texCoord`

You can define new GLSL uniforms in the shader, and set value in layer's `canvascreate` event.
