import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

export default class Loader {

  constructor(physics) {
    this.loader = new GLTFLoader();
    this.physics = physics;
  }

  loadGLTF(scene, path, cast=false, rec=false, pos=null, mass=0, dynamic=false, type="box") {
    this.loader.load(path, (gltf) => {
      const model = gltf.scene;
      
      // Casting/receiving shadows & physics
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = cast;
          obj.receiveShadow = rec;
          if (obj.material.map) obj.material.map.anisotropy = 16;
          if (pos) obj.position.set(...pos);
          this.physics.createRigidBody(obj, mass, dynamic, type);
        }
      });
      scene.add(model);
    });
  }

  // Create test objects with physics
  createObjects(scene) {

    // Box
    this.boxGeo = new THREE.BoxGeometry(2, 2, 2);
    this.boxMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    this.boxMesh = new THREE.Mesh(this.boxGeo, this.boxMat);
    this.boxMesh.position.set(2, 20, 0);
    this.boxMesh.castShadow = true;
    this.boxMesh.receiveShadow = true;
    scene.add(this.boxMesh);

    // Add box body
    this.physics.createRigidBody(this.boxMesh, 100, true);

    // Sphere
    this.sphereGeo = new THREE.SphereGeometry(2);
    this.sphereMat = new THREE.MeshBasicMaterial({
      color: 0x00ff00,
    });
    this.sphereMesh = new THREE.Mesh(this.sphereGeo, this.sphereMat);
    this.sphereMesh.position.set(0, 15, 0);
    this.sphereMesh.castShadow = true;
    this.sphereMesh.receiveShadow = true;
    scene.add(this.sphereMesh);

    // Add sphere body
    this.physics.createRigidBody(this.sphereMesh, 100, true, "sphere");
  }
}