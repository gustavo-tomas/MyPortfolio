import "../public/style.css"

// Three.js
import * as THREE from "three";

// Mouse control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Utils
import * as UTILS from "./utils";

// Assets
import { assets } from "./assets";

// Events
import * as EVENTS from "./events";

// List of clickable objects in the scene
const objects = [];

// List of mixers for each object in the scene
const mixers = [];

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("#ababab");

// Camera setup
const fov = 50; 
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
camera.position.set(0, 5, 5);

// Renderer setup
const renderer = new THREE.WebGL1Renderer();

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
document.body.appendChild(renderer.domElement);

// Clock
const clock = new THREE.Clock();

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 6;
controls.maxDistance = 15;
controls.maxPolarAngle = Math.PI / 2.5;
controls.minPolarAngle = Math.PI / 2.5;

// Light setup

// Point Light
const pointLight = new THREE.PointLight(0xFFFFFF, 1);
pointLight.position.set(0, 7, 0);
pointLight.castShadow = true;
pointLight.shadow.bias = -0.0001;
pointLight.shadow.mapSize.width = 4096;
pointLight.shadow.mapSize.height = 4096;
scene.add(pointLight);

// Hemisphere Light
const hemiLight = new THREE.HemisphereLight(0xFFEEB1, 0x080820, 4);
scene.add(hemiLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const axesHelper = new THREE.AxesHelper(500);
scene.add(axesHelper);

// Loads models, textures and related sections
Object.values(assets).forEach((asset) => {  
  UTILS.load({
    model: asset.model,
    texture: asset.texture,
    assets: assets,
    objects: objects,
    mixers: mixers,
    scene: scene,
    name: asset.name,
  });
});

EVENTS.setEvents({
  renderer: renderer,
  camera: camera,
  assets: assets,
  objects: objects,
});

/**
 * @brief Renders the current scene
 */
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  mixers.forEach((mixer) => { mixer.update(clock.getDelta()); });
  EVENTS.rotateObjects({ objects: objects, assets: assets });
  renderer.render(scene, camera);
}

animate();

console.log(renderer.info);
