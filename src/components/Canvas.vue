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
      :position="{ x: -70, y: 90, z: 30 }"
    />
    <Scene
      ref="scene"
    >
      <DirectionalLight 
        ref="dirLight"
        color="#ffffff"
        cast-shadow
      />
      <AmbientLight 
        :intensity="10.00"
      />
      <GltfModel
        ref="room"
        src="../../assets/models/room.gltf"
        @load="onReady"
      />
      <GltfModel
        ref="coin"
        src="../../assets/models/coin_embedded.gltf"
        :position="{ x: coinXpos, y: coinYpos, z:coinZpos }"
        @load="onReady"
      />
      <GltfModel
        ref="landscape"
        :scale="{ x: 0.5, y: 0.5, z: 0.5 }"
        src="../../assets/landscape_smaller.glb"
        :position="{ y: -4 }"
        @load="onReady"
      />
    </Scene>
  </Renderer>
</div>
</template>

<script>
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

let coinXpos = 0;
let coinYpos = 0;
let coinZpos = 0;

export default {
  name: "Canvas",
  data() {
    return {
      coinXpos: coinXpos,
      coinYpos: coinYpos,
      coinZpos: coinZpos,
    };
  },
  mounted() {

    // Scene setup
    // const scene = this.$refs.scene.scene;
    
    // Loader
    // const loader = new GLTFLoader();

    // Directional light
    const dirLight = this.$refs.dirLight.light;
    dirLight.position.set(-1, 1.75, 1);
    dirLight.intensity = 3.0;

    // Renderer setup
    // const renderer = this.$refs.renderer;
    // renderer.outputEncoding = THREE.sRGBEncoding;
    
    // Update position before each frame
    // renderer.addListener("beforerender", this.move);
    
    // Load test
    // loader.load(
    //   "../../assets/landscape_smaller.glb",
    //   function (gltf) {
    //     const obj = gltf.scene;
    //     obj.scale.set(5, 5, 5);
    //     obj.position.y = -10;
    //     scene.add(obj);
    //   },
    // );
    // renderer.render();
  },
  created() {
    window.addEventListener("keydown", (e) => {
      switch(e.key) {
        case 'a':
          console.log("a");
          coinXpos -= 1;
          break;
        case 'w':
          console.log("w");
          coinYpos += 1;
          break;
        case 's':
          console.log("s");
          coinYpos -= 1;
          break;
        case 'd':
          console.log("d");
          coinXpos += 1;
          break;
        default:
          break;
      }
    });
  },
  methods: {
    move() {
      const coin = this.$refs.coin;
      console.log(coin.position)
      coin.position.x = coinXpos;
      coin.position.y = coinYpos;      
    },
    onReady(model) {
      console.log("Ready", model);
    },
  },
};
</script>
