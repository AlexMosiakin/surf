uniform float time;
varying vec2 vUv;
varying vec4 vPosition;
uniform vec2 pixels;
varying vec3 vNormal;
attribute vec3 position1;
attribute vec3 position2;

void main(){
 vUv = uv;
 vNormal = normal;

 //vec3 pos = position;

//grayklein
 float a = 2.;
 float n = 2.;
 float m = 1.;
 float u = uv.x * 3.1415925*4.;
 float v = uv.y * 3.1415925*2.;
 float x = (a + cos(n*u/2.0) * sin(v) - sin(n*u/2.0) * sin(2.*v)) * cos(m*u/2.0);
 float y = (a + cos(n*u/2.0) * sin(v) - sin(n*u/2.0) * sin(2.*v)) * sin(m*u/2.0);
 float z = sin(n*u/2.0) * sin(v) + cos(n*u/2.0) * sin(2.*v);
 vec3 klein = vec3(x,y,z);

//sphere
 float u1 = uv.x * 3.1415925;
 float v1 = uv.y * -3.1415925*2.;
 float  x1 = sin(u1)*sin(v1);
 float  y1 = sin(u1)*cos(v1);
 float  z1 = cos(u1);
 vec3 sphere = vec3(x1,y1,z1);



 vec3 pos = mix(klein, sphere, 0.5 + 0.5*sin(time/3.));

 //vec3 midpos = mix(position, position1,1.);

 vec3 final = mix(position,position1, 0.5 + 0.5*sin(time/5.));

 gl_Position = projectionMatrix * modelViewMatrix * vec4( final, 1.0 );
}
