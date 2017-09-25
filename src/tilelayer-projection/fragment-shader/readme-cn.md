TileLayer用webgl渲染时, 你可以通过设置fragmentShader, 来替换默认的fragment shader.

[默认的fragment shader GLSL源代码](https://github.com/maptalks/maptalks.js/blob/master/src/renderer/layer/tilelayer/TileLayerGLRenderer.js#L8)如下:

```c
  precision mediump float;

  uniform sampler2D u_image;
  uniform float u_opacity;

  varying vec2 v_texCoord;

  void main() {
      gl_FragColor = texture2D(u_image, v_texCoord) * u_opacity;
  }
```

源代码中必须提供的几个GLSL变量: `u_image`, `u_opacity`, `v_texCoord`.

你可以在shader中定义新的uniform变量, 并在图层的canvascreate事件中给它们赋值.
