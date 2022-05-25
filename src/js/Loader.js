import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Loader {

  constructor() {
    this.loader = new GLTFLoader();
  }

  loadGLTF(scene, path, cast=false, rec=false, callback=()=>{}, texturePath=null) {
    this.loader.load(path, (gltf) => {
      const model = gltf.scene;
      var name = "";

      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(
        texturePath,
        function(texture) {
          const mat = new THREE.MeshBasicMaterial({
            map: texture
          });
          // Casting/receiving shadows
          model.traverse((obj) => {
            if (obj.isMesh) {
              obj.castShadow = cast;
              obj.receiveShadow = rec;
              if (obj.material.map) obj.material.map.anisotropy = 16;
              obj.material = mat;
    
              name = obj.name;
            }
          });
        }
      )

      scene.add(model);
      callback({ model: model, gltf: gltf, name:name, });
    });
  }
}