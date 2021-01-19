let goal_width

class Ball extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y) {
    super(scene.matter.world, x, y, "")

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

    this.body.label = "ball"
    this.prevX = -1
    this.prevY = -1
    //  .setDensity(50)
    // .setBounce(0.3)

    // change global variables
    goal_width = this.game.fieldConfig.goal_width
  }

  postUpdate() {
    this.prevX = this.x
    this.prevY = this.y
  }

  update() {
    if (
      (this.x - this.radius < 0 || this.x + this.radius > this.game.GW) &&
      this.y - this.radius > this.game.ball_inside_goal_bounds.top - 20 &&
      this.y + this.radius < this.game.ball_inside_goal_bounds.down + 20
    ) {
      this.updateScoreAndCollideGoal()
      this.checkIfCollideBottomUpperGoal()
      return
    }
    this.checkWorldBounds()
  }

  checkIfCollideBottomUpperGoal() {
    /// optimise
    if (
      this.y - this.radius < this.game.ball_inside_goal_bounds.top ||
      this.y + this.radius > this.game.ball_inside_goal_bounds.down
    ) {
      this.setVelocityY(-this.body.velocity.y)
      if (this.y - this.radius < this.game.ball_inside_goal_bounds.top) {
        this.y = this.game.ball_inside_goal_bounds.top + this.radius
      } else if (
        this.y + this.radius >
        this.game.ball_inside_goal_bounds.down
      ) {
        this.y = this.game.ball_inside_goal_bounds.down - this.radius
      }
    }
  }

  updateScoreAndCollideGoal() {
    // check if crosses left goal line

    if (this.x - this.radius < 0) {
      this.game.goalScore("left")

      if (this.x - this.radius < 0 - goal_width) {
        this.setVelocityX(-this.body.velocity.x)
        this.x = 0 - goal_width + this.radius
      }
    }
    // check if crosses right goal line
    else {
      this.game.goalScore("right")

      if (this.x + this.radius > this.game.GW + goal_width) {
        this.setVelocityX(-this.body.velocity.x)
        this.x = this.game.GW + goal_width - this.radius
      }
    }
  }

  checkWorldBounds() {
    if (this.x - this.radius < 0 || this.x + this.radius > this.game.GW) {
      this.setVelocityX(-this.body.velocity.x)
      if (this.x - this.radius < 0) this.x = 0 + this.radius
      else if (this.x + this.radius > this.game.GW)
        this.x = this.game.GW - this.radius
    }

    if (this.y - this.radius < 0 || this.y + this.radius > this.game.GH) {
      this.setVelocityY(-this.body.velocity.y)
      if (this.y - this.radius < 0) this.y = 0 + this.radius
      else if (this.y + this.radius > this.game.GH)
        this.y = this.game.GH - this.radius
    }
  }
}

module.exports = Ball
