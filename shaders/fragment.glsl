uniform float time;
uniform float progress;
uniform sampler2D texture1;
uniform sampler2D texture2;
uniform vec4 resolution;
varying vec2 vUv;
varying vec4 vPosition;

varying vec3 vNormal;

void main() {


  float diff = abs(dot(vec3(1.,1.,1.), vNormal));

  //1, 0.7, 0.7,
  //0.8, 0.7, 0.7,
  //0.9, 0.6, 0.7,
  //1., 0.6, 0.7
  //Palette IQ
  //0.8, 0.5, 0.4		0.2, 0.4, 0.2	2.0, 1.0, 1.0	0.00, 0.25, 0.25
  vec3 a = vec3(0.8, 0.5, 0.4);
  vec3 b = vec3(0.2, 0.4, 0.2);
  vec3 c = vec3(2.0, 1.0, 1.0);
	vec3 d = vec3(0.00, 0.25, 0.25);
  vec3 color = a + b * cos(2.*3.14*(c*diff+d + time/5.));

  gl_FragColor = vec4(color, 1.);
}
