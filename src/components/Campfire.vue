<template>
</template>

<script>
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

import Renderer from "../js/Renderer";
import Scene from "../js/Scene";
import Camera from "../js/Camera";
import Light from "../js/Light";
import Helper from "../js/Helper";
import Loader from "../js/Loader";
import Composer from "../js/PostProcessing";

export default {
  name: "Campfire",
  methods: {

    // Initializes several objects
    init() {
      this.initGraphics();
      this.initUtils();
      this.initEvents();
    },

    // Initializes renderer, scene, lights, objects, ...
    initGraphics() {

      // Scene
      this.scene = new Scene();
      this.scene.createScene("#000000");

      // Cameras
      this.camera = new Camera();
      this.camera.camera.position.set(15, 5, 15);

      // Raycaster
      this.raycaster = new THREE.Raycaster();

      // Renderer
      this.renderer = new Renderer();
      this.renderer.createRenderer();
      document.body.appendChild(this.renderer.renderer.domElement);

      // Post processing
      this.composer = new Composer({
        renderer: this.renderer.renderer,
        scene: this.scene.scene,
        camera: this.camera.camera
      });

      // Lights
      this.light = new Light();
      this.light.createPoint(0xF9D97B, 1.5);
      this.light.pointLight.position.set(0, 0.5, 0)
      this.scene.scene.add(...this.light.lights)

      // Model & Text loader
      this.loader = new Loader();
      this.loader.loadGLTF(this.scene.scene, '../../assets/campfire.glb', true, true);
    },

    // Initializes common utilities (clock, stats, ...)
    initUtils() {

      // Clock
      this.clock = new THREE.Clock();
      
      // Stats
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);

      // Orbit controls (camera can override controls)
      this.controls = new OrbitControls(this.camera.camera, this.renderer.renderer.domElement);
      this.controls.enableDamping = true;
      this.controls.maxDistance = 10;
      this.controls.minDistance = 3; 
      this.controls.maxPolarAngle = Math.PI / 2.5;

      // Helpers
      this.helper = new Helper();
      this.helper.createPointHelper(this.light.pointLight);
      this.helper.createGridHelper();
      this.helper.createAxesHelper();
      // this.scene.scene.add(...this.helper.helpers);
    },

    // 
    initEvents() {
      this.renderer.renderer.domElement.addEventListener("click", (e) => {
        const mouse = new THREE.Vector2();
        this.raycaster.setFromCamera(mouse, this.camera.camera);
        
        var obj = this.scene.scene.getObjectByName("Campfire");
        if (obj) {
          const intersects = this.raycaster.intersectObjects([obj], true);
          if (intersects.length > 0) {
            
            // Hardcoded to exemplify
            var selectedObject = intersects[0];
            selectedObject.userData = { URL: "https://youtube.com" };
            // window.open(selectedObject.object.userData.URL);
            console.log(selectedObject);
          }
        }
      });
    },

    // Updates objects in each frame
    animate() {
      requestAnimationFrame(this.animate);

      // Get current time
      const delta = this.clock.getDelta();
      
      // Updates FPS counter
      this.stats.update();

      // Update controls
      this.controls.update();

      // Updates rendered scene & camera
      this.composer.render();

      // Rotates the campfire if already loaded
      if (!this.obj)
        this.obj = this.scene.scene.getObjectByName("Campfire");
      if (this.obj)
        this.obj.rotation.y += 0.003;
    },
  },
  mounted() {
    this.init();
    this.animate();
  },
};
</script>

<style scoped>
</style>