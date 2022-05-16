import * as THREE from "three";

export default class Camera {
  
  constructor(fov=75, aspectRatio=window.innerWidth/window.innerHeight, near=0.1, far=1000) {
    this.camera = new THREE.PerspectiveCamera(
      fov,
      aspectRatio,
      near,
      far
    );
    this.camera.position.set(0, 5, 15);
    this.init();
  }

  init() {
    window.addEventListener("resize", (e) => this.updateProjection(), false);
  }

  updateProjection() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}