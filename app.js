import * as THREE from "./three";

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import * as dat from "dat.gui";

import { TimelineMax } from "gsap";
let OrbitControls = require("three-orbit-controls")(THREE);

export default class Sketch{
  constructor(selector){
    this.scene = new THREE.Scene();


    this.renderer = new THREE.WebGLRenderer();
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.width, this.height);
    this.renderer.setClearColor(0xE4C0C4, 1);

    this.container = document.getElementById("container");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.container.appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      70,
      window.innerWidth / window.innerHeight,
      0.001,
      1000,
    );

    this.camera.position.set(0,0,10);
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.time = 0;

    this.paused = false;

    this.setupResize();
    this.tabEvents();

    this.addObjects();
    this.resize();
    this.render();
  }

  settings(){
    let that = this;
    this.settings ={
      time:0,
    };
    this.gui = new dat.GUI();
    this.gui.add(this.settings, 'time', 0, 100, 0.01)
  }

  setupResize(){
    window.addEventListener('resize', this.resize.bind(this));
  }

  resize(){
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.imageAspect = 853/1280;
    let a1; let a2;
    if (this.height/ this.width > this.imageAspect) {
      a1 = (this.width / this.height) * this.imageAspect;
      a2 = 1;
    } else {
        a1 = 1;
        a2 = (this.height / this.width) * this.imageAspect;
      }

    this.material.uniforms.resolution.value.x = this.width;
    this.material.uniforms.resolution.value.y = this.height;
    this.material.uniforms.resolution.value.z = a1;
    this.material.uniforms.resolution.value.w = a2;

    this.camera.updateProjectionMatrix();
  }

  addObjects(){
    let that = this;
    this.material = new THREE.ShaderMaterial({
      extensions:{
        derivatives: "#extension GL_OES_standart_derivatives : enable"
      },
      side:THREE.DoubleSide,
      uniforms:{
        time:{type:"f", value:0},
        resolution:{type:"v4", value:new THREE.Vector4()},
        uvRate1:{
          value:new THREE.Vector2(1,1)
        }
      },

      //wireframe: true,
      vertexShader: vertex,
      fragmentShader: fragment,
    });


      this.geometry = new THREE.PlaneGeometry(1,1,10,10);

      this.geometry = new THREE.ParametricBufferGeometry(this.torFunction, 100, 100 );
      this.geometry1 = new THREE.ParametricBufferGeometry(this.graykleinFunction, 100, 100 );
      this.geometry2 = new THREE.ParametricBufferGeometry(this.kleinFunction, 100, 100 );

      this.geometry.setAttribute('position1', new THREE.BufferAttribute(this.geometry1.attributes.position.array,3));
      this.geometry.setAttribute('position2', new THREE.BufferAttribute(this.geometry2.attributes.position.array,3));

      this.plane = new THREE.Mesh(this.geometry, this.material);
      this.scene.add(this.plane);
  }

  planeFunction(u,v,target){
    let x = u;
    let y = v;
    let z = 0;

    target.set( x, y, z );
  }

  kleinFunction(u,v,target){
    //Paul Bourke 1990
    let a = 1;

    u *= Math.PI*2;
    v *= Math.PI*2;

    let x = Math.cos(u) * (a + Math.sin(v) * Math.cos(u/2) - Math.sin(2*v) * Math.sin(u/2)/2);
    let y = Math.sin(u) * (a + Math.sin(v) * Math.cos(u/2) - Math.sin(2*v) * Math.sin(u/2)/2);
    let z = Math.sin(u/2) * Math.sin(v) + Math.cos(u/2)/2 * Math.sin(2*v)/2;

    target.set( x, y, z );
  }

  graykleinFunction(u,v,target){
    //Paul Bourke 1990

    let a = 3;
    let n = 2;
    let m = 1;

    u *= Math.PI*4;
    v *= Math.PI*2;
    u -=- Math.PI;

    let x = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.cos(m*u/2.0)
    let y = (a + Math.cos(n*u/2.0) * Math.sin(v) - Math.sin(n*u/2.0) * Math.sin(2*v)) * Math.sin(m*u/2.0)
    let z = Math.sin(n*u/2.0) * Math.sin(v) + Math.cos(n*u/2.0) * Math.sin(2*v)


    target.set( x, y, z );
  }


  sphereFunction(u,v,target){
    //Paul Berke 1990
    u *= Math.PI;
    v *= -Math.PI*2;

    let x = Math.sin(u)*Math.sin(v);
    let y = Math.sin(u)*Math.cos(v);
    let z = Math.cos(u);

    target.set( x, y, z );
  }

  torFunction(u,v,target){
    //Paul Berke 1990
    u *= Math.PI*2;
    v *= Math.PI*2;

    let x = Math.cos(v) + Math.sin(u) * Math.cos(v);
    let y = Math.sin(v) + Math.sin(u) * Math.sin(v);
    let z = Math.cos(u);

    target.set( x, y, z );
  }


  tabEvents(){
    document.addEventListener('visibilitychange', ()=>{
      if(document.hidden){
        this.stop()
      } else {
        this.play();
      }
    });
  }

  stop(){
    this.paused = true;
  }

  play(){
    this.paused = false;
  }

  render(){
    if(this.paused) return;

    //this.geometry.vertices.forEach((vector) => {

      //let u = (vector.x + 0.5)*Math.PI*2;
      //let v = (vector.y + 0.5)*Math.PI;


      //v.z = 0.5*Math.sin(v.y*50.);
    //});

    //this.geometry.vertices.needsUpdate = true;
    this.time += 0.05;
    this.material.uniforms.time.value = this.time;
    this.plane.rotation.x = this.time*0.2;
		this.plane.rotation.y = this.time*0.2;
    requestAnimationFrame(this.render.bind(this));
    this.renderer.render(this.scene, this.camera);
  }
}


new Sketch("container");
