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
import Composer from "../js/PostProcessing";

import CharacterController from "../js/controller/CharacterController";
import ThirdPersonCamera from "../js/controller/ThirdPersonCamera";

export default {
  name: "CannonGame",
  methods: {

    // Initializes several objects
    init() {
      this.initPhysics();
      this.initGraphics();
      this.initUtils();
      this.initControllers();
    },

    // Initializes renderer, scene, lights, objects, ...
    initGraphics() {

      // Scene
      this.scene = new Scene();
      this.scene.createScene("#A3E3FA");

      // Cameras
      this.camera = new Camera();
      this.thirdPersonCamera = new ThirdPersonCamera({
        camera: this.camera.camera,
      });

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
      // this.light.createDirectional(0xffffbb, 4, true, [100,100,100]);
      this.light.createHemi(0xffeeb1, 0x080820, 4);
      this.light.createSpot(0xffa95c, 4);
      this.scene.scene.add(...this.light.lights);
      
      // Model(Not player model) & Text loader
      this.loader = new Loader(this.physics, this.player);
      this.loader.createObjects(this.scene.scene);

      // Player is loaded in the controller, everything else here
      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/coin.gltf', true, true, [0, 10, 0], 10000, true, "sphere");
      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/ball.glb', true, true, [0, 10, 0], 10000, true, "sphere");

      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/fountain.glb', true, false);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/room_sep.glb', true, true);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/fonts/lol.glb', true, true);
      
      // this.loader.loadGLTF(this.scene.scene, '../../assets/landscape.glb', true, true);
      this.loader.loadGLTF(this.scene.scene, '../../assets/plane.glb', true, true);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/models/test.gltf', true, true, [1, 20, 3], 10, true, "sphere");
      // this.loader.loadGLTF(this.scene.scene, '../../assets/adamHead/adamHead.gltf', true, true, [5, 5, 5], 0, false);

      // this.loader.loadOBJ(this.scene.scene, '../../assets/models/fountain.obj');
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

      // Helpers
      this.helper = new Helper();
      this.helper.createDirHelper(this.light.dirLight);
      this.helper.createHemiHelper(this.light.hemiLight);
      // this.helper.createSpotHelper(this.light.spotLight);
      this.helper.createGridHelper();
      this.helper.createAxesHelper();
      this.helper.createCameraHelper(this.camera.camera);
      this.scene.scene.add(...this.helper.helpers);
    },

    // Initializes physics
    initPhysics() {
      this.physics = new Physics();
    },

    // Initializes player & camera controllers
    initControllers() {
      this.characterController = new CharacterController({
        scene: this.scene.scene,
        physics: this.physics  
      });
    },

    // Updates objects in each frame
    animate() {
      requestAnimationFrame(this.animate);

      // Get current time
      const delta = this.clock.getDelta();
      
      // Updates physics
      this.physics.updatePhysics(delta);

      // Updates character properties 
      this.characterController.update(delta);

      // Update lights
      this.light.updateLights(this.camera.camera);

      // Updates camera
      this.thirdPersonCamera.updateThirdPersonCamera({
        delta: delta,
        target: this.physics.getRigidBodyByName("Player")[0],
      });

      // Updates rendered scene & camera
      this.composer.render();
      // this.renderer.render(this.scene.scene, this.camera.camera);
      
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