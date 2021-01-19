export default class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, sprite) {
    super(scene.matter.world, x, y, sprite)

    scene.add.existing(this)
    this.game = scene

    this.diameter = 42
    this.radius = this.diameter / 2

    this.setCircle(this.radius)
      .setFixedRotation()
      .setMass(50)
      // .setFrictionStatic(0)
      .setFrictionAir(0.03)
      .setName("ball")
  }
}
