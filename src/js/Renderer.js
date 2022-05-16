import * as THREE from "three";

export default class Renderer {

  constructor() {
    this.createRenderer();
    window.addEventListener("resize", (e) => this.resize(), false);
  }

  createRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      powerPreference: "high-performance",
      antialias: true,
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.shadowMap.enabled = true;
    this.renderer.toneMapping = THREE.ReinhardToneMapping;
    this.renderer.toneMappingExposure = 2.3;
    
    // this.renderer.shadowMap.type = THREE.PCFShadowMap;
    // this.renderer.shadowMapSoft = true;
    // this.renderer.outputEncoding = THREE.sRGBEncoding;
  }

  // Set renderer size on resize
  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  render(scene, camera) {
    this.renderer.render(scene, camera);
  }
}