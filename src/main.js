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

// Scene setup
const scene = new THREE.Scene();
scene.background = new THREE.Color("#FFFFFF");

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
document.body.appendChild(renderer.domElement);

// Camera controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.autoRotate = true;
controls.autoRotateSpeed = 0.7;
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2.5;
controls.minPolarAngle = Math.PI / 2.5;

// Light setup
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(0, 3, 0);
scene.add(pointLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

// Loads models, textures and related sections
Object.values(assets).forEach((asset) => {  
  UTILS.load({
    model: asset.model,
    texture: asset.texture,
    assets: assets,
    objects: objects,
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
  EVENTS.rotateObjects({ objects: objects, assets: assets });
  renderer.render(scene, camera);
}

animate();

console.log(renderer.info);
