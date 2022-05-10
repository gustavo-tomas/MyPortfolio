<template>
<div id="container">
</div>
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
import Physics from "../js/Physics";
import PlayerController from "../js/controller/PlayerController";

export default {
  name: "Canvas",
  methods: {

    // Initializes several objects
    init() {
      this.initPhysics();
      this.initGraphics();
      this.initControllers();
      this.initEventListeners();
    },

    // Initializes renderer, scene, lights, objects, ...
    initGraphics() {

      // Scene
      this.scene = new Scene();
      this.scene.createScene("#DEFEFF");

      // Camera
      this.camera = new Camera();
      this.camera.camera.position.set(1, 10, 10);

      // Renderer
      this.renderer = new Renderer();
      this.renderer.createRenderer();
      document.body.appendChild(this.renderer.renderer.domElement);

      // Directional light
      this.dirLight = new Light();
      this.scene.scene.add(this.dirLight.light);

      // Helpers
      this.helper = new Helper(this.dirLight.light);
      this.scene.scene.add(this.helper.lightHelper, this.helper.gridHelper);

      // Orbit controls
      this.controls = new OrbitControls(this.camera.camera, this.renderer.renderer.domElement);
      
      // Clock
      this.clock = new THREE.Clock();
      
      // Stats panel
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);
      
      // Model & Text loader
      this.loader = new Loader(this.physics);
      this.loader.createObjects(this.scene.scene);
      this.loader.loadGLTF(this.scene.scene, '../../assets/models/coin.gltf', true, false, [0, 10, 0], 10000, true, "sphere");
      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/room_sep.glb', false, true);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/landscape.glb', false, true);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/fonts/lol.glb', true, true);
    },

    // Initializes physics
    initPhysics() {
      this.physics = new Physics();
    },

    // Initializes controllers
    initControllers() {
      this.playerController = new PlayerController(this.physics);
    },

    // Initializes event listeners
    initEventListeners() {
      window.addEventListener('resize', (e) => {
        this.camera.updateProjection();
        this.renderer.renderer.setSize(window.innerWidth, window.innerHeight);
      });
      
      window.addEventListener('keypress', (e) => {
        this.playerController.onKeyPress(e);
      });
      
      window.addEventListener('keyup', (e) => {
        this.playerController.onKeyUp(e);
      });
    },

    // Updates objects in each frame
    animate() {
      requestAnimationFrame(this.animate);

      // Get current time
      const delta = this.clock.getDelta();
      
      // Updates physics
      this.physics.updatePhysics(delta);

      // Updates rendered scene & camera
      this.renderer.render(this.scene.scene, this.camera.camera);
      
      // Updates FPS counter
      this.stats.update();
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