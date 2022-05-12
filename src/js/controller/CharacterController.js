// I have no ideia how this works. 
// https://www.youtube.com/watch?v=EkPfhzIbp2g

import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

class CharacterControllerProxy {
  constructor(animations) {
    this._animations = animations;
  }

  get animations() {
    return this._animations;
  }
}

export default class CharacterController {

  constructor(params) {
    this.init(params);
  }
  
  init(params) {
    this.params = params;

    this.decceleration = new THREE.Vector3(-0.0005, -0.0001, -5.0);
    this.acceleration = new THREE.Vector3(100, 0.25, 50.0);
    this.velocity = new THREE.Vector3(0, 0, 0);

    this.animations = {};
    this.input = new CharacterControllerInput();
    this.stateMachine = new CharacterFSM(
      new CharacterControllerProxy(this.animations),
    );
    this.loadModels();
  }
  
  // Loads character models and animations
  loadModels() {
    const loader = new GLTFLoader();
    loader.setPath("../../../assets/models/");
    loader.load("ball.gltf", (gltf) => {
      const model = gltf.scene;
    
      // Casting/receiving shadows & physics
      model.traverse((obj) => {
        if (obj.isMesh) {
          obj.castShadow = true;
          obj.receiveShadow = true;
          if (obj.material.map) obj.material.map.anisotropy = 16;
          obj.position.set(0, 10, 0);
          this.params.physics.createRigidBody(obj, 10000, true, "box"); // dont let it roll over!
        }
      });
      this.params.scene.add(model);

      this.target = gltf;
      this.mixer = new THREE.AnimationMixer(this.target);

      const animations = gltf.animations;
      for (let i = 0; i < animations.length; i++) {
        const clip = animations[i];
        const action = this.mixer.clipAction(clip);
  
        this.animations[clip.name] = {
          clip: clip,
          action: action,
        };
      }

      this.manager = new THREE.LoadingManager();
      this.manager.onLoad = () => {
        this.stateMachine.setState("idle");
      }
    });
  }

  update(delta) {
    if (!this.target) return;

    this.stateMachine.update(delta, this.input);

    const velocity = this.velocity;
    const frameDecceleration = new THREE.Vector3(
      velocity.x * this.decceleration.x,
      velocity.y * this.decceleration.y,
      velocity.z * this.decceleration.z,
    );
    frameDecceleration.multiplyScalar(delta);
    frameDecceleration.z = Math.sign(frameDecceleration.z) * Math.min(
      Math.abs(frameDecceleration.z), Math.abs(velocity.z)
    );

    velocity.add(frameDecceleration);

    const rigidbody = this.params.physics.getRigidBodyByName("Player")[0];

    const controlObject = this.target.scene;
    let _Q = new THREE.Quaternion();
    let _A = new THREE.Vector3();
    let _R = rigidbody.body.quaternion;

    const acc = this.acceleration;
    if (this.input.keys.shift) {
      acc.multiplyScalar(1.05);
    }
    if (this.input.keys.forward) {
      velocity.z += acc.z * delta;
    }
    if (this.input.keys.backward) {
      velocity.z -= acc.z * delta;
    }
    if (this.input.keys.left) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * Math.PI * delta * this.acceleration.y);
      _R = _R.mult(_Q);
    }
    if (this.input.keys.right) {
      _A.set(0, 1, 0);
      _Q.setFromAxisAngle(_A, 4.0 * -Math.PI * delta * this.acceleration.y);
      _R = _R.mult(_Q);
    }

    rigidbody.body.quaternion.copy(_R);

    const oldPosition = new THREE.Vector3();
    oldPosition.copy(rigidbody.body.position);

    const forward = new THREE.Vector3(0, 0, 1);
    forward.applyQuaternion(rigidbody.body.quaternion);
    forward.normalize();

    const sideways = new THREE.Vector3(1, 0, 0);
    sideways.applyQuaternion(rigidbody.body.quaternion);
    sideways.normalize();

    sideways.multiplyScalar(velocity.x * delta);
    forward.multiplyScalar(velocity.z * delta);

    // TODO: make this work
    rigidbody.body.position = rigidbody.body.position.vadd(forward);
    rigidbody.body.position = rigidbody.body.position.vadd(sideways);

    oldPosition.copy(rigidbody.body.position);

    // console.log("ACC: ", this.acceleration);
    // console.log("VEL: ", this.velocity);
    // console.log("FOR: ", forward);
    // console.log("SIDE: ", sideways);

    if (this._mixer) {
      this._mixer.update(delta);
    }
  }
}

class CharacterControllerInput {

  constructor() {
    this.init();
  }

  init() {
    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      space: false,
      shift: false,
      ctrl: false,
      alt: false,
    };
    this.moves = {
      forward: 87,  // w
      left: 65,     // a
      backward: 83, // s
      right: 68,    // d
      space: 32,
      shift: 16,
    }
    window.addEventListener("keydown", (e) => this.onKeyDown(e), false);
    window.addEventListener("keyup", (e) => this.onKeyUp(e), false);
  }

  // 
  onKeyDown(e) {
    // console.log(e.keyCode, "pressed\n", this.keys);
    switch(e.keyCode) {
      case this.moves.forward:
        this.keys.forward = true;
        break;
      case this.moves.left:
        this.keys.left = true;
        break;
      case this.moves.backward:
        this.keys.backward = true;
        break;
      case this.moves.right:
        this.keys.right = true;
        break;
      case this.moves.space:
        this.keys.space = true;
        break;
      case this.moves.shift:
        this.keys.shift = true;
        break;
      default:
        break;
    }
  }

  // 
  onKeyUp(e) {
    // console.log(e.keyCode, "released\n", this.keys);
    switch(e.keyCode) {
      case this.moves.forward:
        this.keys.forward = false;
        break;
      case this.moves.left:
        this.keys.left = false;
        break;
      case this.moves.backward:
        this.keys.backward = false;
        break;
      case this.moves.right:
        this.keys.right = false;
        break;
      case this.moves.space:
        this.keys.space = false;
        break;
      case this.moves.shift:
        this.keys.shift = false;
        break;
      default:
        break;
    }
  }
}

class FiniteStateMachine {

  constructor() {
    this.states = {};
    this.currentState = null;
  }

  addState(name, type) {
    this.states[name] = type;
  }

  setState(name) {
    const prevState = this.currentState;

    if (prevState) {
      if (prevState.name == name) {
        return;
      }
      prevState.exit();
    }

    const state = new this.states[name](this);

    this.currentState = state;
    state.enter(prevState);
  }

  update(delta, input) {
    if (this.currentState) {
      this.currentState.update(delta, input);
    }
  }
}

class CharacterFSM extends FiniteStateMachine {
  
  constructor(proxy) {
    super();
    this.proxy = proxy;
    this.init();
  }

  init() {
    this.addState("idle", IdleState);
    this.addState("walk", WalkState);
  }
}

class State {
  constructor(parent) {
    this._parent = parent;
  }

  Enter() {}
  Exit() {}
  Update() {}
};


class IdleState extends State {
  
  constructor(parent) {
    super(parent);
  } 

  get name() {
    return "idle";
  }

  enter(prevState) {
    const idleAction = this.parent.proxy.animations["idle"].action;
    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;
      idleAction.time = 0.0;
      idleAction.enabled = true;
      idleAction.setEffectiveTimeScale(1.0);
      idleAction.setEffectiveWeight(1.0);
      idleAction.crossFadeFrom(prevAction, 0.5, true);
      idleAction.play();
    } else {
      idleAction.play();
    }
  }

  exit() {

  }

  update(_, input) {
    if (input.move.forward || input.move.backward) {
      this.parent.setState("walk");
    } else if (input.move.space) {
      this.parent.setState("idle");
    }
  }
}

class WalkState extends State {

  constructor(parent) {
    super(parent);
  }

  get name() {
    return "walk";
  }

  enter(prevState) {
    const currAction = this.parent.proxy.animations["walk"].action;
    if (prevState) {
      const prevAction = this.parent.proxy.animations[prevState.name].action;

      currAction.enabled = true;

      // TODO: no running in the halls
      if (prevState.name == "run") {
        
      } else {
        currAction.time = 0.0;
        currAction.setEffectiveTimeScale(1.0);
        currAction.setEffectiveWeight(1.0);
      }

      currAction.crossFadeFrom(prevAction, 0.5, true);
      currAction.play();
    } else {
      currAction.play();
    }
  }

  exit() {

  }

  update(delta, input) {
    if (input.move.forward || input.move.backward) {
      if (input.move.shift) {
        // TODO: rrrrruningg
      }
      return;
    }
    this.parent.setState("idle");
  }
}