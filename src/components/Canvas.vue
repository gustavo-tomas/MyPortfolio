<template>
<div id="container">
  <Renderer
    ref="renderer"
    resize="window"
    orbitCtrl
    shadow
  >
    <Camera
      ref="camera"
      :far=20000
      :position="{ x: -7, y: 19, z: -9 }"
    />
    <Scene
      ref="scene"
      background="#DEFEFF"
    >
      <DirectionalLight 
        ref="dirLight"
        color="#ffffff"
        cast-shadow
      />
      <GltfModel
        ref="room"
        src="../../assets/models/room.gltf"
        @load="onLoad"
      />
      <!-- <GltfModel
        ref="coin"
        src="../../assets/models/coin_embedded.gltf"
        @load="onLoad"
      /> -->
      <GltfModel
        ref="landscape"
        :scale="{ x: 1.0, y: 1.0, z: 1.0 }"
        src="../../assets/landscape.glb"
        @load="onLoad"
      />
    </Scene>
  </Renderer>
</div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { Object3D } from "troisjs";

export default {
  name: "Canvas",
  mounted() {

    // Scene setup
    const scene = this.$refs.scene.scene;

    // Loader
    const loader = new GLTFLoader();

    // Loading object
    loader.load('../../assets/models/coin_embedded.gltf', (gltf) => {
      const root = gltf.scene;

      root.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
        }
      });
      scene.add(root);
    });

    // Background setup
    // const backgroundTexture = new THREE.TextureLoader().load("../../assets/frog.jpeg");
    // scene.background = backgroundTexture;

    // Directional light
    const dirLight = this.$refs.dirLight.light;
    dirLight.position.set(-1, 1.75, 1);
    dirLight.intensity = 1.5;

    // Renderer setup
    // const renderer = this.$refs.renderer;
  },
  methods: {
    onLoad(model) {
      console.log("Model loaded", model);
      if (typeof model != Object3D) {
        console.log("Model is not of type 'Object3D'");
        return;
      }
      model.traverse(function (child) {
        if (child.isMesh) {
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });
    },
  },
};
</script>
