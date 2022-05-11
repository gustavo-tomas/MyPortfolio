import * as THREE from "three";

export default class Scene {

  constructor() {
  }

  createScene(bgColor="#000000", fogNear=1, fogFar=500) {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgColor);
    this.scene.fog = new THREE.Fog(this.scene.background, fogNear, fogFar);
  }
}