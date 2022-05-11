import * as THREE from "three";

export default class Light {
  
  constructor() {

    // Array of lights
    this.lights = [];
  }

  // Create a directional light
  createDirectional(color=0xffffff, intensity=1.0, castShadow=true, position=[1,1,1]) {
    this.dirLight = new THREE.DirectionalLight(color);
    this.dirLight.intensity = intensity;
    this.dirLight.castShadow = castShadow;
    this.dirLight.shadow.camera = new THREE.OrthographicCamera(-100, 100, 100, -100, 0.0001, 1000)
    this.dirLight.shadow.bias = -0.0001;
    this.dirLight.shadow.mapSize.width = 4096;
    this.dirLight.shadow.mapSize.height = 4096;
    this.dirLight.position.set(...position);
    this.lights.push(this.dirLight);
  }

  // Create a hemisphere light
  createHemi(color=0xffffff, groundColor=0x000000, intensity=1.0) {
    this.hemiLight = new THREE.HemisphereLight(color, groundColor, intensity);
    this.lights.push(this.hemiLight);
  }

  // Create a spotlight
  createSpot(color=0xffffff, intensity=1.0, castShadow=true) {
    this.spotLight = new THREE.SpotLight(color, intensity);
    this.spotLight.castShadow = castShadow;
    this.spotLight.shadow.bias = -0.0001;
    this.spotLight.shadow.mapSize.width = 4096;
    this.spotLight.shadow.mapSize.height = 4096;
    this.lights.push(this.spotLight);
  }

  // Update position of light
  updateLights(camera) {
    if (this.spotLight === undefined) return;
    this.spotLight.position.set(
      camera.position.x + 10,
      camera.position.y + 10,
      camera.position.z + 10,
    );
  }
}