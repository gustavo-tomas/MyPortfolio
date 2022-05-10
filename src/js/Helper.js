import * as THREE from "three";

export default class Helper {

  constructor(light) {
    this.lightHelper = new THREE.DirectionalLightHelper(light);
    this.gridHelper = new THREE.GridHelper(200, 50);
  }
}