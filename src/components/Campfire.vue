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
    },

    // Initializes renderer, scene, lights, objects, ...
    initGraphics() {

      // Scene
      this.scene = new Scene();
      this.scene.createScene();

      // Cameras
      this.camera = new Camera();
      this.camera.camera.position.set(15, 5, 15);

      // Raycaster
      this.raycaster = new THREE.Raycaster();
      this.mouse = new THREE.Vector2();

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
      this.light.createPoint(0xF9D97B, 1.0);
      this.light.pointLight.distance = 1000;
      this.light.pointLight.decay = 2;
      this.light.pointLight.power = 40;
      this.light.pointLight.position.set(0, 0.5, 0);
      
      this.light.createHemi(0x000066, 0xf3f3f3, 0.7);
      this.scene.scene.add(...this.light.lights);

      // Model & Text loader
      this.loader = new Loader();
      // this.loader.loadGLTF(this.scene.scene, '../../assets/campfire.glb', true, true);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/full.glb', true, true);
      
      function callMe() {

      }
      
      this.loader.loadGLTF(this.scene.scene, '../../assets/room.glb', true, true, callMe, "../../assets/floorBake.png");
      this.loader.loadGLTF(this.scene.scene, '../../assets/full.glb', true, true);
      this.loader.loadGLTF(this.scene.scene, '../../assets/wall.glb', true, true, callMe, "../../assets/wallBake.png");
      this.loader.loadGLTF(this.scene.scene, '../../assets/board.glb', true, true, callMe, "../../assets/BoardBake.png");
      // this.loader.loadGLTF(this.scene.scene, '../../assets/git.glb', true, true, this.addToCampfire);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/test.glb', true, true, this.addToCampfire);
      // this.loader.loadGLTF(this.scene.scene, '../../assets/lamps.glb', true, true);

      this.renderer.renderer.domElement.addEventListener("dblclick", this.onDblClick, false);
      // this.renderer.renderer.domElement.addEventListener("mousemove", this.onMove, false);
    },

    addToCampfire(params) {
      if (!this.campfire) this.campfire = new Map();
      const mixer = new THREE.AnimationMixer(params.gltf.scene);
      
      // play anims here
      this.campfire.set(params.name, {
        model: params.model,
        gltf: params.gltf,
        mixer: mixer,
      });
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
      this.controls.minPolarAngle = Math.PI / 5;
      this.controls.enablePan = false;

      // Helpers
      this.helper = new Helper();
      this.helper.createPointHelper(this.light.pointLight);
      this.helper.createGridHelper();
      this.helper.createAxesHelper();
      // this.scene.scene.add(...this.helper.helpers);
    },

    onDblClick(e) {
      this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera.camera);

      const objects = [
        this.scene.scene.getObjectByName("Campfire"),
        this.scene.scene.getObjectByName("Test"),
      ];
      
      if (objects) {
        var intersects = this.raycaster.intersectObjects(objects, true);
        if (intersects.length > 0) {
          var selectedObject = intersects[0]; // First intersected object

          console.log("CLICK", selectedObject)
          switch(selectedObject.object.name) {
            case "GithubCoin":
              selectedObject.userData = { URL: "https://github.com" };
              break;
            case "Campfire_1":
              selectedObject.userData = { URL: "https://github.com" };
              break;
            default:
              break;
          }

          window.open(selectedObject.userData.URL, "_blank");
        }
      }
    },

    // 
    onMove(e) {
      this.mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
      this.mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;
      this.raycaster.setFromCamera(this.mouse, this.camera.camera);

      const objects = [
        this.scene.scene.getObjectByName("GithubCoin"),
      ];
      
      if (objects) {
        var intersects = this.raycaster.intersectObjects(objects, true);
        if (intersects.length > 0) {
          var selectedObject = intersects[0]; // First intersected object
          console.log("HOVER", selectedObject)
          selectedObject.object.rotation.z += 0.005;
        }
      }
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

      // Updates animations
      if (this.campfire) {
        this.campfire.forEach((item) => {
          const mixer = item.mixer;
          mixer.update(delta);
        })
      }

      // Updates rendered scene & camera
      // this.renderer.renderer.render(this.scene.scene, this.camera.camera);
      this.composer.render();

      // console.log("Scene polycount:", this.renderer.renderer.info.render.triangles)
      // console.log("Active Drawcalls:", this.renderer.renderer.info.render.calls)
      // console.log("Textures in Memory", this.renderer.renderer.info.memory.textures)
      // console.log("Geometries in Memory", this.renderer.renderer.info.memory.geometries)

      // Rotates the campfire if already loaded
      if (!this.obj)
        this.obj = this.scene.scene.getObjectByName("Campfire");
      else
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