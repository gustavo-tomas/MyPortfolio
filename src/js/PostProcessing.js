import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass";

export default class Composer {

  constructor(params) {
    this.params = params;
    this.renderer = this.params.renderer;
    this.scene = this.params.scene;
    this.camera = this.params.camera;
    
    this.init();
  }
  
  // 
  init() {
    this.composer = new EffectComposer(this.renderer);
    this.composer.addPass(new RenderPass(this.scene, this.camera));

    //                                        Resolution, Strength, Radius, Threshold    
    // this.composer.addPass(new UnrealBloomPass({x: 1024, y:1024}, 0.2, 0.0, 0.75));
  }

  // Renders a scene
  render() {
    this.composer.render();
  }
}