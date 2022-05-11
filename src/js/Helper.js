import * as THREE from "three";

export default class Helper {

  constructor() {

    // Array of helpers
    this.helpers = [];
  }
  
  // Creates directional light helpers
  createDirHelper(light) {
    if (light === undefined) return;
    this.dirHelper = new THREE.DirectionalLightHelper(light);
    this.helpers.push(this.dirHelper);
  }

  // Creates hemi light helpers
  createHemiHelper(light) {
    if (light === undefined) return;
    this.hemiHelper = new THREE.HemisphereLightHelper(light);
    this.helpers.push(this.hemiHelper);
  }

  // Creates spot light helpers
  createSpotHelper(light) {
    if (light === undefined) return;
    this.spotHelper = new THREE.SpotLightHelper(light);
    this.helpers.push(this.spotHelper);
  }

  // Creates a grid helper
  createGridHelper(size=2000, divisions=500) {
    this.gridHelper = new THREE.GridHelper(size, divisions);
    this.helpers.push(this.gridHelper);
  }

  // Creates axes helper
  createAxesHelper(size=500) {
    this.axesHelper = new THREE.AxesHelper(size);
    this.helpers.push(this.axesHelper);
  }

  // Creates a camera helper
  createCameraHelper(camera) {
    if (camera === undefined) return;
    this.cameraHelper = new THREE.CameraHelper(camera);
    this.helpers.push(this.cameraHelper);
  }
}