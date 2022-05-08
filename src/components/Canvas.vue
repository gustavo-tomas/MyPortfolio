<template>
<div id="container">
  <canvas ref="bg"></canvas>
</div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Loader
const loader = new GLTFLoader();

// Mixer
let mixer;

export default {
  name: "Canvas",
  data() {
    return {
      loader: loader,
      mixer: mixer,
    };
  },
  mounted() {

    // Scene setup
    const scene = new THREE.Scene();

    // Camera setup
    const fov = 75; 
    const aspectRatio = window.innerWidth / window.innerHeight;
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
    camera.position.z = 30;

    // Renderer setup
    const renderer = new THREE.WebGL1Renderer({
      canvas: this.$refs.bg,
      antialias: true,
      alpha: true,
    });

    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);

    renderer.shadowMap.type = THREE.PCFShadowMap;
    renderer.shadowMap.enabled = true;
    renderer.shadowMapSoft = true;
    renderer.outputEncoding = THREE.sRGBEncoding;

    // Directional light
    const dirLight = new THREE.DirectionalLight(0xFFFFFF);
    dirLight.position.set(1, 10.75, 10);
    dirLight.intensity = 1.5;
    dirLight.castShadow = true;
    scene.add(dirLight);

    // Helpers
    const lightHelper = new THREE.PointLightHelper(dirLight);
    scene.add(lightHelper);

    const gridHelper = new THREE.GridHelper(200, 50);
    scene.add(gridHelper);

    // Orbit controls
    const controls = new OrbitControls(camera, renderer.domElement);

    scene.background = new THREE.Color("#DEFEFF");

    // Updates render on each frame
    function animate() {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    }

    // Plays specific animation
    function playAnimation() {

    }

    // Updates the render size on window resize
    function onWindowResize() {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    }

    // Updates character position based on key pressed
    function onKeyPress(e) {
      const coin = scene.getObjectByName("Coin");

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
      
      coin.position.x += valX;
      coin.position.y += valY;
      coin.position.z += valZ;

      playAnimation();
    }

    // Loading objects
    this.load('../../assets/models/coin.gltf', scene, true);
    // this.load('../../assets/models/room_sep.glb', scene, false, true);
    // this.load('../../assets/landscape.glb', scene, false, true);

    window.addEventListener('resize', onWindowResize);
    window.addEventListener('keydown', onKeyPress);
    animate();
  },
  methods: {
    
    // Loads GLTF objects with shadows disabled
    load(path, scene, cast=false, rec=false) {
      this.loader.load(path, (gltf) => {
        const root = gltf.scene;
        root.traverse((obj) => {
          if (obj.isMesh) {
            obj.castShadow = cast;
            obj.receiveShadow = rec;
          }
        });
        
        this.mixer = new THREE.AnimationMixer(root);
        const action = this.mixer.clipAction(gltf.animations[0]);
        action.play();
        
        scene.add(root);
      });
    },
  },
};
</script>

<style scoped>
canvas {
  display: block;
}
</style>