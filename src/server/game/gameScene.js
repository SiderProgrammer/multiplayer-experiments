const config = require("./settings/config")
const courtConfig = require("./settings/courtConfig")

const helper = require("./gameState")

const startPositions = require("./settings/startPositions")
const classesProperties = require("./settings/classesProperties")

const Player = require("./mainClasses/player")
const Ball = require("./mainClasses/ball")
const TimeManager = require("./managers/timeManager")

class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" })
    this.player_count_id = 0
  }

  init(data) {
    this.room_name = data.room_name
    this.io = data.io
  }

  getId() {
    return this.player_count_id++
  }

  getPlayerState(player) {
    return {
      x: player.x,
      y: player.y,
      shoot: player.shoot,
      player_id: player.player_id,
    }
  }

  findPlayer(id) {
    return this.players.find((player) => player.player_id === id)
  }

  getState() {
    const players_state = []
    const game_state = {
      field_type: config.field_type,
      time: TimeManager.getTime(),
      //  global_time:Date.now(),
      score: helper.score,
    }

    if (this.players.length !== 0) {
      this.players.forEach((player) => {
        players_state.push(this.getPlayerState(player))
      })
    }

    return {
      court_config: courtConfig,
      players_state,
      game_state,
      ball_state: {
        x: this.ball.x,
        y: this.ball.y,
      },
    }
  }

  create() {
    this.positions = startPositions

    this.players = []

    this.matter.world.disableGravity()
    this.courtConfig = courtConfig
    this.goal_just_shot = false
    this.ball_started = false
    this.is_draw = false

    this.fieldConfig = this.courtConfig[config.field_type]

    this.GW = this.fieldConfig.width
    this.GH = this.fieldConfig.height

    this.ball_inside_goal_bounds = {
      top: this.GH / 2 - this.fieldConfig.goal_height * 0.5,
      down: this.GH / 2 + this.fieldConfig.goal_height * 0.5,
    }

    this.player_bounds = {
      left:
        0 -
        this.fieldConfig.goal_width -
        this.courtConfig.additional_bounds_space,
      right:
        this.GW +
        this.fieldConfig.goal_width +
        this.courtConfig.additional_bounds_space,
      down: this.GH + this.courtConfig.additional_bounds_space,
      up: 0 - this.courtConfig.additional_bounds_space,
    }

    this.ball = new Ball(this, this.GW / 2, this.GH / 2)
  }

  update() {
    const updates = []
    this.players.forEach((player) => {
      this.updateBallKick(player)
      player.update() // here?

      const x = player.x != player.prevX
      const y = player.y != player.prevY
      const shoot = player.shoot != player.prevShoot

      if (x || y || shoot) {
        updates.push(this.getPlayerState(player))
      }

      player.postUpdate()
    })

    if (updates.length > 0) {
      this.io.room(this.room_name).emit("updatePlayers", updates)
    }

    if (this.ball.x != this.ball.prevX || this.ball.y != this.ball.prevY) {
      this.ball.update()
      this.ball.postUpdate()

      this.io
        .room(this.room_name)
        .emit("updateBall", { x: this.ball.x, y: this.ball.y })
    }
  }

  updateBallKick(player) {
    if (!player.shoot || player.justKickedBall) return

    if (
      Math.sqrt((player.x - this.ball.x) ** 2 + (player.y - this.ball.y) ** 2) <
      player.diameter / 2 + this.ball.radius + player.graphicsBorder_width
    ) {
      // this.io.room().emit("stopShoot",player.player_id)
      player.justKickedBall = true
      player.shoot = false
      // if(this.player.cursors.space.isDown && !this.player.justKickedBall){
      // if(!this.ball_started){ this.startMatch() }

      // this.player.justKickedBall = true;
      // this.player.stopShoot(true)

      const angle = Phaser.Math.Angle.Between(
        player.x,
        player.y,
        this.ball.x,
        this.ball.y
      )
      this.matter.applyForceFromAngle(this.ball, player.shoot_force, angle)
      //  }
    }
  }

  startMatch() {
    this.ball_started = true

    //  this.block_squares.forEach(b=>b.destroy());
    //  this.block_squares.length = 0;

    TimeManager.startMeasureTime(this)
  }

  goalScore(side) {
    if (this.goal_just_shot) return

    this.goal_just_shot = true

    if (side == "left") helper.score.red++
    else helper.score.blue++

    TimeManager.stopMeasureTime()
    //   DOM.score.innerHTML = `${helper.score.red}:${helper.score.blue}`
    //   TimeManager.stopMeasureTime()

    //  setTimeout(()=>this.handleGoalScored(),1000)
  }

  handleGoalScored() {
    // this.updatePlayer = false;
    if (this.is_draw) {
      if (helper.score.red > helper.score.blue) {
        createTextSlide(textManager.red_won)
      } else {
        createTextSlide(textManager.blue_won)
      }
    }

    if (helper.score.blue === this.courtConfig.score_to_win) {
      createTextSlide(textManager.blue_won)
    } else if (helper.score.red === this.courtConfig.score_to_win) {
      createTextSzzzlide(textManager.red_won)
    } else {
      this.scene.restart()
    }
  }

  bindServerFunctions(channel) {
    channel.onDisconnect(() => {
      console.log(`Disconnect user ${channel.id}`)

      const player = this.findPlayer(channel.player_id)
      player.kill()
      this.players.splice(this.players.indexOf(player), 1)

      channel.room.emit("removePlayer", channel.player_id)
    })

    channel.on("playerMove", (data) => {
      const player = this.findPlayer(channel.player_id)
      if (player) player.updatePosition(data)
    })

    channel.on("changeShoot", (is_shooting) => {
      const player = this.findPlayer(channel.player_id)
      if (!player) return

      if (is_shooting) {
        player.shoot = true
        player.justKickedBall = false
      } else {
        player.shoot = false
      }
    })

    channel.on("addPlayer", () => {
      channel.player_id = this.getId()

      const new_player = new Player(
        this,
        100,
        250,
        "red",
        classesProperties.basic,
        channel.player_id
      )

      new_player.setOnCollideWith(this.ball, () => {
        if (this.ball_started) return
        this.startMatch()
      })

      this.players.push(new_player)
      channel.emit("getId", channel.player_id)
    })

    channel.emit("ready")
  }
}

module.exports = GameScene
