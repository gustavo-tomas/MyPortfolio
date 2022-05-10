import * as THREE from "three";

export default class Light {
  
  constructor(color=0xFFFFFF) {
    this.light = new THREE.DirectionalLight(color);
    this.light.intensity = 1.0;
    this.light.castShadow = true;
    this.light.position.set(1, 10.75, 10);
  }
}