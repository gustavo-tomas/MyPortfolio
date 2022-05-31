// Three.js
import * as THREE from "three";

// Loader of GLTF format
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// Paths
const modelsPath = "./public/assets/models/";
const audiosPath = "./public/assets/audios/";

/**
 * @brief Loads html file into a given Section 
 * @param {Object} params - Object with the parameters of the div
 * @param {String} sectionID - The ID of the section to load the HTML file
 * @param {File} sectionFile - The HTML file to be inserted into the section
 */
function loadSections(params) {
  const contentDiv = document.getElementById(params.sectionID);
  if (contentDiv)
    contentDiv.innerHTML += params.assets[params.sectionID].description;
}

/**
 * @brief Sets visibility of given div
 * @param {Object} params - Object with the parameters of the div
 * @param {String} divID - The ID of the div
 * @param {String} visibility - The style visibility value of the div
 */
export function setVisibility(params) {
  if (!params.divID) return;
  const contentDiv = document.getElementById(params.divID);
  contentDiv.style.visibility = params.visibility;
}

/**
 * @TODO
 * @param {*} params 
 */
export function load(params) {
  loadSections({
    assets: params.assets,
    sectionID: params.name,
  });
  loadModels(params);
  loadAudio(params);
}

/**
 * @TODO
 * @param {*} params 
 */
function loadModels(params) {
  // GLTF Loader
  const loader = new GLTFLoader();

  loader.load(
    modelsPath + params.model,
    function (gltf) {
      const model = gltf.scene;
      model.scale.set(2, 2, 2);
      
      const name = params.model.split(".")[0];
      // Mapping textures & shadows
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;

          if (obj.material.map)
            obj.material.map.anisotropy = 16;
          
          obj.userData.url = params.assets[name].url;
          
          if (params.assets[name].mesh) {
            params.assets[name].mesh.push(obj);
            params.objects.push(obj);
          }
        }
      });

      // Loading animations
      const animations = gltf.animations;
      
      if (animations.length > 0) {
        const mixer = new THREE.AnimationMixer(model);
        const action = mixer.clipAction(animations[0]);
        action.play();

        params.mixers.push(mixer);
      }
      params.scene.add(model);
    }
  );
}

/**
 * @TODO
 * @param {*} params 
 */
function loadAudio(params) {
  if (params.assets[params.name].audio) {
    const audioFile = audiosPath + params.assets[params.name].audio.default;
    const div = document.getElementById("audio");
    const audio = document.createElement("audio");
    audio.setAttribute("src", audioFile);

    div.appendChild(audio);
  }
}

/**
 * @TODO
 * @param {*} params 
 * @returns 
 */
export function getIntersection(params) {
  // Raycaster
  var raycaster = new THREE.Raycaster();
  var mouse = new THREE.Vector2();

  mouse.x = (params.event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = - (params.event.clientY / window.innerHeight) * 2 + 1;
  raycaster.setFromCamera(mouse, params.camera);

  return raycaster.intersectObjects(params.objects);
}
