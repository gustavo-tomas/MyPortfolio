import * as CANNON from "cannon-es";
import * as THREE from "three";

export default class Physics {

  constructor() {

    this.rigidBodies = [];
    this.gravityConstant = 9.81;

    // Create physics world
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, - this.gravityConstant, 0),
    });
  }

  // TODO: fix borders
  // Creates a cube or sphere rigidbody for a mesh
  createRigidBody(mesh, mass=0, dynamic=false, type="box") {

    // Calculates dimensions of the mesh
    const cubeBoundingBox = new THREE.Box3().setFromObject(mesh);
    let boxSize = new THREE.Vector3();
    cubeBoundingBox.getSize(boxSize);
    
    const size = [boxSize.x, boxSize.y, boxSize.z];
    
    if (type === "box")
      size.forEach((s, i) => {size[i] /= 2});

    const pos = [mesh.position.x, mesh.position.y, mesh.position.z];
    
    // Create mesh rigidbody as a cube
    const body = new CANNON.Body({
      mass: mass, // mass 0 for static bodies
      shape: type === "box" ? new CANNON.Box(new CANNON.Vec3(...size)) : new CANNON.Sphere(2),
      position: new CANNON.Vec3(...pos),
      type: dynamic ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC,
    });
    
    // console.log(size, pos, body); // DEBUG

    // Dampings
    body.linearDamping = 0.3;
    body.angularDamping = 0.5;
    
    this.world.addBody(body);
    this.rigidBodies.push({ body: body, mesh: mesh });
    
    // Testing plane
    if (this.rigidBodies.length === 1)
      body.quaternion.setFromEuler(-Math.PI / 2, 0, 0); // rotation for horizontal plane
  }

  // Updates physics of each object
  updatePhysics(delta) {
    this.world.step(delta);
    
    for (let i = 0; i < this.rigidBodies.length; i++) {
      const rigidbody = this.rigidBodies[i];
      rigidbody.mesh.position.copy(rigidbody.body.position);
      rigidbody.mesh.quaternion.copy(rigidbody.body.quaternion);
    }
  }
}