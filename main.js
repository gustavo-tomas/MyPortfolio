import "./style.css"

// Three.js
import * as THREE from "three";

// Loader of GLTF format
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// Mouse control
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// Scene setup
const scene = new THREE.Scene();

// Camera setup
const fov = 75; 
const aspectRatio = window.innerWidth / window.innerHeight;
const near = 0.1;
const far = 1000;
const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

// Renderer setup
const renderer = new THREE.WebGL1Renderer({
  canvas: document.querySelector("#bg"),
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);

camera.position.setZ(30);

// 3D Object
// const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
// const material = new THREE.MeshStandardMaterial({ color: 0x44FF63 });
// const torus = new THREE.Mesh(geometry, material);

// scene.add(torus);

// Light setup
const pointLight = new THREE.PointLight(0xFFFFFF);
pointLight.position.set(1.0, 10, 4.5);
scene.add(pointLight);

// const ambientLight = new THREE.AmbientLight(0xFFFFFF);
// scene.add(ambientLight);

// Helpers
const lightHelper = new THREE.PointLightHelper(pointLight);
scene.add(lightHelper);

const gridHelper = new THREE.GridHelper(200, 50);
scene.add(gridHelper);

const controls = new OrbitControls(camera, renderer.domElement);

/**
 * @brief Renders the current scene
 */
function animate() {
  requestAnimationFrame(animate);

  // torus.rotation.x += 0.01;
  // torus.rotation.y += 0.005;
  // torus.rotation.z += 0.01;

  controls.update();

  renderer.render(scene, camera);
}

/**
 * @brief Creates stars to populate the scene
 */
function addStar() {
  const geometry = new THREE.SphereGeometry(0.25, 24, 24);
  const material = new THREE.MeshStandardMaterial({ color: 0xFFFFFF})
  const star = new THREE.Mesh(geometry, material);

  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(100));

  star.position.set(x, y, z);
  scene.add(star);
}

Array(200).fill().forEach(addStar);

// TODO: loading bar can be set with a callback function
// Background setup
const spaceTexture = new THREE.TextureLoader().load("./assets/frog.jpeg");
scene.background = spaceTexture;

// FrogSphere setup
const frogTexture = new THREE.TextureLoader().load("./assets/frog.jpeg");
const normalFrogTexture = new THREE.TextureLoader().load("./assets/coin_texture.png"); // doesnt exist

const frog = new THREE.Mesh(
  new THREE.SphereGeometry(3, 32, 32),
  new THREE.MeshStandardMaterial({
    map: frogTexture,
    normalMap: normalFrogTexture
  })
);

scene.add(frog);

frog.position.z = 30;
frog.position.x = -10;

/**
 * @brief Moves the camera as the page scrolls
 */
function moveCamera() {
  const t = document.body.getBoundingClientRect().top;
  frog.rotation.x += 0.05;
  frog.rotation.y += 0.075;
  frog.rotation.z += 0.05;

  camera.position.x = t * -0.0002;
  camera.position.y = t * -0.0002;
  camera.position.z = t * -0.01;
}

// document.body.onscroll = moveCamera;

// Load objects in gltf format
var loader = new GLTFLoader();

loader.load(
  "./assets/coin_detailed.glb",
  function (gltf) {
    const coin = gltf.scene;
    coin.scale.set(2, 2, 2);
    coin.position.y = 4;
    scene.add(coin);
  },
);

animate();