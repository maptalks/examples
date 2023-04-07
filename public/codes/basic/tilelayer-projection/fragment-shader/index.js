const tileLayer = new maptalks.TileLayer("carto", {
  urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  subdomains: ["a", "b", "c"],
  // fragment shader from webglfundamentals.org
  // https://webglfundamentals.org/webgl/lessons/webgl-image-processing.html
  fragmentShader: [
    "precision mediump float;" +
      "uniform sampler2D u_image;" +
      "uniform vec2 u_textureSize;" +
      "uniform float u_kernel[9];" +
      "uniform float u_opacity;" +
      "uniform float u_kernelWeight;" +
      "varying vec2 v_texCoord;" +
      "void main() {" +
      "vec2 onePixel = vec2(1.0, 1.0) / u_textureSize;" +
      "vec4 colorSum =" +
      "texture2D(u_image, v_texCoord + onePixel * vec2(-1, -1)) * u_kernel[0] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 0, -1)) * u_kernel[1] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 1, -1)) * u_kernel[2] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2(-1,  0)) * u_kernel[3] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 0,  0)) * u_kernel[4] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 1,  0)) * u_kernel[5] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2(-1,  1)) * u_kernel[6] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 0,  1)) * u_kernel[7] +" +
      "texture2D(u_image, v_texCoord + onePixel * vec2( 1,  1)) * u_kernel[8] ;" +
      "gl_FragColor = vec4((colorSum / u_kernelWeight).rgb, 1) * u_opacity;" +
      "}",
  ].join("\n"),
});

tileLayer.on("canvascreate", function (e) {
  // set uniform values in shader
  const gl = e.gl;
  const program = gl.program;
  const textureSizeLocation = gl.getUniformLocation(program, "u_textureSize");
  const kernelLocation = gl.getUniformLocation(program, "u_kernel[0]");
  const kernelWeightLocation = gl.getUniformLocation(program, "u_kernelWeight");
  // kernels of sobelVertical in the original example
  const kernels = [1, 0, -1, 2, 0, -2, 1, 0, -1];
  gl.uniform2f(textureSizeLocation, 256, 256);
  gl.uniform1fv(kernelLocation, new Float32Array(kernels));
  gl.uniform1f(kernelWeightLocation, computeKernelWeight(kernels));
});

const map1 = new maptalks.Map("map1", {
  center: [-0.113049, 51.498568],
  zoom: 4,
  attribution: {
    content: "&copy OpenStreetMap",
  },
  baseLayer: tileLayer,
});

function computeKernelWeight(kernel) {
  const weight = kernel.reduce(function (prev, curr) {
    return prev + curr;
  });
  return weight <= 0 ? 1 : weight;
}

// original
const map0 = new maptalks.Map("map0", {
  center: [-0.113049, 51.498568],
  zoom: 4,
  attribution: {
    content: "&copy OpenStreetMap",
  },
  baseLayer: new maptalks.TileLayer("base", {
    urlTemplate: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    subdomains: ["a", "b", "c"],
  }),
});
