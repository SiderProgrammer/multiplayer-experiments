export default class Player extends Phaser.Physics.Matter.Sprite {
  constructor(scene, x, y, team, myClass) {
    super(scene.matter.world, x, y, "skin_1")

    scene.add.existing(this)

    this.game = scene
    this.team = team
    /*
        setScale: function (x, y, point)
        {
            if (x === undefined) { x = 1; }
            if (y === undefined) { y = x; }
    
            var factorX = 1 / this._scaleX;
            var factorY = 1 / this._scaleY;
    
            this._scaleX = x;
            this._scaleY = y;
    
            Body.scale(this.body, factorX, factorY, point);
    
            Body.scale(this.body, x, y, point);
    
            return this;
        }
        */
    this.prevX = -1
    this.prevY = -1
    this.prevShoot = false
    this.shoot = false

    this.graphicsBorder_width = 10

    this.diameter = 87
    this.radius = this.diameter / 2
    //   document.querySelectorAll("[data-hook]")
    this.setCircle(this.diameter * 0.5 + this.graphicsBorder_width * 0.5)
      .setFixedRotation()
      .setFrictionAir(myClass.friction_air)
      .setMass(myClass.mass)
      .setName("player")
    // this body scale to increase radius
    this.body.label = "player"
    this.justKickedBall = false

    this.inCircle = false

    this.shoot_force = 3
    this.thrust_force = myClass.thrust_force
    this.middleCircleCollide_velocity = 2

    //   this.out_collidingZone_area =
    //     this.game.courtConfig.middle_circle_radius + this.radius // + this.player.graphicsBorder_width
    //   this.in_collidingZone_area =
    //     this.game.courtConfig.middle_circle_radius - this.radius // - this.player.graphicsBorder_width

    this.prevNoMovement = true
  }

  shoot() {}
  stopShoot() {}
  kill() {
    this.destroy()
  }

  update() {
    this.checkWorldBounds()
    this.checkMiddleCircleCollision()
    this.checkMiddleLineCollision()
  }

  updatePosition(data) {
    let thrust = this.thrust_force // ACCELERATION EFFECT!

    /*
        this.thrust_force +=0.001
        if(thrust > 0.15) this.thrust_force = 0.01        
                */ if (
      (data.left || data.right) &&
      (data.up || data.down)
    ) {
      thrust = Math.sqrt(Math.pow(thrust, 2) / 2)
    }

    if (data.left) {
      this.thrustBack(thrust)
    } else if (data.right) {
      this.thrust(thrust)
    }

    if (data.up) {
      this.thrustLeft(thrust)
    } else if (data.down) {
      this.thrustRight(thrust)
    }
  }

  postUpdate() {
    this.prevX = this.x
    this.prevY = this.y
    this.prevShoot = this.shoot
  }

  checkWorldBounds() {
    if (this.x - this.radius < this.game.player_bounds.left) {
      this.x = this.game.player_bounds.left + this.radius
      this.setVelocityX(0)
    } else if (this.x + this.radius > this.game.player_bounds.right) {
      this.x = this.game.player_bounds.right - this.radius
      this.setVelocityX(0)
    }

    if (this.y - this.radius < this.game.player_bounds.up) {
      this.y = this.game.player_bounds.up + this.radius
      this.setVelocityY(0)
    } else if (this.y + this.radius > this.game.player_bounds.down) {
      this.y = this.game.player_bounds.down - this.radius
      this.setVelocityY(0)
    }
  }

  checkMiddleLineCollision() {
    if (this.game.ball_started) return

    if (
      this.y < this.game.GH / 2 + this.game.courtConfig.middle_circle_radius &&
      this.y > this.game.GH / 2 - this.game.courtConfig.middle_circle_radius
    )
      return

    if (
      this.team === "red" &&
      this.x + this.radius + this.graphicsBorder_width > this.game.GW / 2
    ) {
      this.x = this.game.GW / 2 - this.radius - this.graphicsBorder_width
      this.setVelocityX(0)
    } else if (
      this.team === "blue" &&
      this.x - this.radius - this.graphicsBorder_width < this.game.GW / 2
    ) {
      this.x = this.game.GW / 2 + this.radius + this.graphicsBorder_width
      this.setVelocityX(0)
    }
  }

  checkMiddleCircleCollision() {
    if (this.game.ball_started) return

    const distance = Math.sqrt(
      this.x - this.game.GW / 2 ** 2 + this.y - this.game.GH / 2 ** 2
    )
    const is_inColldingZone_out = distance < this.out_collidingZone_area
    const is_inColldingZone_in = distance > this.in_collidingZone_area

    if (is_inColldingZone_out && is_inColldingZone_in) {
      if (this.x > this.game.GW / 2 && helper.start_ball_team === "red") {
        if (this.inCircle) this.setVelocityX(-this.middleCircleCollide_velocity)
        else this.setVelocityX(this.middleCircleCollide_velocity)
      } else if (
        helper.start_ball_team === "blue" &&
        this.x < this.game.GW / 2
      ) {
        if (this.inCircle) this.setVelocityX(this.middleCircleCollide_velocity)
        else this.setVelocityX(-this.middleCircleCollide_velocity)
      }

      if (
        (helper.start_ball_team === "red" && this.x > this.game.GW / 2) ||
        (helper.start_ball_team === "blue" && this.x < this.game.GW / 2)
      ) {
        if (this.y > this.game.GH / 2) {
          if (this.inCircle)
            this.setVelocityY(-this.middleCircleCollide_velocity)
          else this.setVelocityY(this.middleCircleCollide_velocity)
        } else {
          if (this.inCircle)
            this.setVelocityY(this.middleCircleCollide_velocity)
          else this.setVelocityY(-this.middleCircleCollide_velocity)
        }
      }
    } else if (distance > this.out_collidingZone_area) this.inCircle = false
    else if (distance < this.in_collidingZone_area) this.inCircle = true
  }
}
