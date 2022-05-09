<template>
<div id="container">
</div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import Stats from "stats.js";

export default {
  name: "Canvas",
  methods: {
    init() {

      // Scene
      this.scene = new THREE.Scene();
      this.scene.background = new THREE.Color("#DEFEFF");

      // Camera
      this.camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        10000
      );
      this.camera.position.set(1, 10, 10);

      // Renderer
      this.renderer = new THREE.WebGLRenderer();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.renderer.setPixelRatio(window.devicePixelRatio);
      this.renderer.shadowMap.type = THREE.PCFShadowMap;
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMapSoft = true;
      this.renderer.outputEncoding = THREE.sRGBEncoding;
      document.body.appendChild(this.renderer.domElement);

      // Directional light
      this.dirLight = new THREE.DirectionalLight(0xFFFFFF);
      this.dirLight.position.set(1, 10.75, 10);
      this.dirLight.intensity = 1.0;
      this.dirLight.castShadow = true;
      this.scene.add(this.dirLight);

      // Helpers
      this.lightHelper = new THREE.PointLightHelper(this.dirLight);
      this.scene.add(this.lightHelper);
      this.gridHelper = new THREE.GridHelper(200, 50);
      this.scene.add(this.gridHelper);

      // Orbit controls
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
      
      // Model loader
      this.loader = new GLTFLoader();
      this.loadGLTF('../../assets/models/coin.gltf', true);
      this.loadGLTF('../../assets/models/room_sep.glb', false, true);
      this.loadGLTF('../../assets/landscape.glb', false, true);

      // Mixer
      this.mixer = new THREE.AnimationMixer();

      // Clock
      this.clock = new THREE.Clock();

      // Stats panel
      this.stats = new Stats();
      this.stats.showPanel(0);
      document.body.appendChild(this.stats.dom);

      // Text
      this.loadGLTF('../../assets/fonts/lol.glb', true, true);

      // Event listeners 
      window.addEventListener('resize', this.onWindowResize);
      window.addEventListener('keypress', this.onKeyPress);
      window.addEventListener('keyup', this.onKeyUp);
    },

    // Updates each frame
    animate() {
      requestAnimationFrame(this.animate);
      this.stats.begin();

      const delta = this.clock.getDelta();
      this.mixer.update(delta);

      this.renderer.render(this.scene, this.camera);
      this.stats.end();
    },

    // Loads models and related properties
    loadGLTF(path, cast=false, rec=false) {
      this.loader.load(path, (gltf) => {
        const model = gltf.scene;
        
        // Casting/receiving shadows
        model.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = cast;
            obj.receiveShadow = rec;
          }
        });

        // Loading animations
        this.animations = gltf.animations;
        this.mixer = new THREE.AnimationMixer(model);

        this.scene.add(model);
      });
    },
    
    // Play animation
    playAnimation() {
      // const player = this.scene.getObjectByName("Coin");
      if (this.animations.length > 0) {
        const action = this.mixer.clipAction(this.animations[0]);
        action.play();
        // this.animate();
      } else {
        console.log("No animations to play");
      }
    },

    // Stop animation
    stopAnimation() {
      if (this.animations.length > 0) {
        const action = this.mixer.clipAction(this.animations[0]);
        action.stop();
      } else {
        console.log("No animations to stop");
      }
    },

    // Updates renderer size on resize
    onWindowResize() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    // Updates character position based on key pressed
    onKeyPress(e) {
      const player = this.scene.getObjectByName("Coin");
      console.log(e.key, "key was pressed")
      let valX = 0, valY = 0, valZ = 0;
      if (e.key == 'a')
        valX = -1;
      else if (e.key == 'd')
        valX = 1;
      else if (e.key == 's')
        valZ = 1;
      else if (e.key == 'w')
        valZ = -1;
      
      player.position.x += valX;
      player.position.y += valY;
      player.position.z += valZ;
      
      this.playAnimation();
    },

    // Updates movement animation on key release
    onKeyUp(e) {
      const moves = ['w', 'a', 's', 'd'];
      console.log(e.key, "was released");
      if (moves.includes(e.key)) {
        this.stopAnimation();  
      }
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