export default class PlayerController {

  constructor(scene, physics) {
    this.physics = physics;
    this.scene = scene;
  }

  // Updates character position based on key pressed
  onKeyPress(e) {
    // const player = this.scene.getObjectByName("Coin");
    
    // TODO: Change name 'Coin' to 'Player'
    let player;
    for (let i = 0; i < this.physics.rigidBodies.length; i++) {
      const rigidbody = this.physics.rigidBodies[i];
      if (rigidbody.mesh.name == "Coin") {
        player = rigidbody;
        break;
      }
    }

    // console.log(e.key, "key was pressed"); // DEBUG

    let valX = 0, valY = 0, valZ = 0;
    if (e.key == 'a')
      valX = -1;
    else if (e.key == 'd')
      valX = 1;
    else if (e.key == 's')
      valZ = 1;
    else if (e.key == 'w')
      valZ = -1;
    else if (e.key == ' ')
      valY += 5;

    player.body.position.x += valX;
    player.body.position.y += valY;
    player.body.position.z += valZ;
  }

  // Updates movement animation on key release
  onKeyUp(e) {
    const moves = ['w', 'a', 's', 'd'];
    // console.log(e.key, "was released"); // DEBUG
  }
}