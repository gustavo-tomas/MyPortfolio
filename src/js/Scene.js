import * as THREE from "three";

export default class Scene {

  constructor() {
  }

  createScene(bgColor="#000000") {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(bgColor);
  }
}