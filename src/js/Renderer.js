import * as THREE from "three";

export default class Renderer {

  constructor() {
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.type = THREE.PCFShadowMap;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}