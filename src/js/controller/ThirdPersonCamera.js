// https://www.youtube.com/watch?v=UuNPHOJ_V5o

import * as THREE from "three";

export default class ThirdPersonCamera {
  
  constructor(params) {
    this.params = params;
    this.camera = params.camera;

    this.currentPosition = new THREE.Vector3();
    this.currentLookat = new THREE.Vector3();
  }

  // TODO: collapse the 2 ideals into 1
  // Calculates ideal camera offset
  calculateIdealOffset(target) {
    const idealOffset = new THREE.Vector3(-4, 5, -10);
    idealOffset.applyQuaternion(target.quaternion); // .rotation
    idealOffset.add(target.position);
    return idealOffset;
  }

  // Calculates ideal camera lookat
  calculateIdealLookat(target) {
    const idealLookat = new THREE.Vector3(0, -15, 50);
    idealLookat.applyQuaternion(target.quaternion); //.rotation
    idealLookat.add(target.position);
    return idealLookat;
  }

  // Updates camera with player input
  updateThirdPersonCamera(params) {
    if (params.target === undefined) return;
    else params.target = params.target.mesh;

    const idealOffset = this.calculateIdealOffset(params.target);
    const idealLookat = this.calculateIdealLookat(params.target);

    const t = 1.0 - Math.pow(0.001, params.delta);

    this.currentPosition.lerp(idealOffset, t);
    this.currentLookat.lerp(idealLookat, t);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookat);
  }
}