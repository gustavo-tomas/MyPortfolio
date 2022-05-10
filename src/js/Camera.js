import * as THREE from "three";

export default class Camera {
  
  constructor(fov=75, aspectRatio=window.innerWidth/window.innerHeight, near=0.1, far=10000) {
    this.camera = new THREE.PerspectiveCamera(
      fov,
      aspectRatio,
      near,
      far
    );
  }

  updateProjection() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}