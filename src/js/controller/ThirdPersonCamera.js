import * as THREE from "three";

export default class ThirdPersonCamera {
  
  constructor(params) {
    this.params = params;
    this.camera = params.camera;
    this.physics = params.physics;
    this.target = params.target;

    if (this.target === undefined)
      this.getTarget();

    this.currentPosition = new THREE.Vector3();
    this.currentLookat = new THREE.Vector3();
  }

  // TODO: collapse the 2 ideals into 1
  // Calculates ideal camera offset
  calculateIdealOffset() {
    const idealOffset = new THREE.Vector3(-15, 20, -30);
    idealOffset.applyQuaternion(this.params.target.rotation);
    idealOffset.add(this.params.target.position);
    return idealOffset;
  }

  // Calculates ideal camera lookat
  calculateIdealLookat() {
    const idealLookat = new THREE.Vector3(0, 10, 50);
    idealLookat.applyQuaternion(this.params.target.rotation);
    idealLookat.add(this.params.target.position);
    return idealLookat;
  }

  // Updates camera with player input
  updateThirdPersonCamera(delta) {
    const idealOffset = this.calculateIdealOffset();
    const idealLookat = this.calculateIdealLookat();

    this.currentPosition.copy(idealOffset);
    this.currentLookat.copy(idealLookat);

    this.camera.position.copy(this.currentPosition);
    this.camera.lookAt(this.currentLookat);
  }

  // 
  getTarget() {
    for (let i = 0; i < this.physics.rigidBodies.length; i++) {
      const rigidbody = this.physics.rigidBodies[i];
      if (rigidbody.mesh.name == "Player") {
        this.target = rigidbody;
        break;
      }
    }
  }
}