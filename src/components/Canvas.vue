<template>
<div ref="canvas"></div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Active scene
const scene = new THREE.Scene();

// Main camera
const fov = 75; 
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

// Lights
const pointLight = new THREE.PointLight(0xFFFFFF);
const ambientLight = new THREE.AmbientLight(0xFFFFFF);

// Objects
const loader = new GLTFLoader();

// Renderer
const renderer = new THREE.WebGL1Renderer({});

export default {
  name: "Canvas",
  data() {
    return {
      scene: scene,
      camera: camera,
      pointLight: pointLight,
      ambientLight: ambientLight,
      loader: loader,
      renderer: renderer,
    };
  },
  created() {
    this.scene.add(this.camera);
    this.scene.add(this.pointLight);
    // this.loadAsset(this.scene, "../../public/assets/models/coin.glb");
    this.pointLight.position.set(0, 0, 10);
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  },
  mounted() {
    this.$refs.canvas.appendChild(this.renderer.domElement);
    this.animate();
  },
  methods: {
    animate() {
      requestAnimationFrame(this.animate);
      this.renderer.render(this.scene, this.camera);
    },
    loadAsset(scene, glbObject) {
      this.loader.load(
        glbObject,
        function (gltf) {
          const object = gltf.scene;
          object.scale.set(2, 2, 2);
          object.position.y = 4;
          scene.add(object);
        },
      );
    },
  },
};
</script>