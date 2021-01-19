import axios from "axios"

import depths from "../settings/depths"

import { DOM_elements as DOM } from "../dom/domElements"

import textConfig from "../settings/textConfig"

import Player from "../mainClasses/player"
import Ball from "../mainClasses/ball"

import KeyboardManager from "../managers/keyboardManager"
import FieldManager from "../managers/fieldManager"
import GoalElementsManager from "../managers/goalManager"
import TimeManager from "../managers/timeManager"
import classesProperties from "../../../shared/settings/classesProperties"

export default class GameScene extends Phaser.Scene {
  constructor() {
    super("GameScene")
    this.players = {}
    this.my_id = ""
    this.court_config = {}
  }

  init({ channel, game_width, game_height }) {
    this.channel = channel
    this.GW = game_width
    this.GH = game_height
  }

  async create() {
    this.matter.world.disableGravity()
    console.log("client phaser instance created")
    this.state_fetched = false
    this.goal_just_shot = false
    this.is_draw = false
    this.depths = depths
    this.field_type = ""

    this.channel.on("updatePlayers", (updates) => {
      this.handleUpdates(updates)
    })

    this.channel.on("getId", (id) => {
      this.my_id = id
    })

    this.channel.on("updateBall", (update) => {
      if (!this.ball) return
      this.ball.x = update.x + this.server_difference_x
      this.ball.y = update.y + this.server_difference_y
    })

    this.channel.on("removePlayer", (player_id) => {
      this.players[player_id].kill()
      delete this.players[player_id]
    })

    this.channel.on("timeUpdate", (time) => {
      DOM.time.innerHTML = `${time.tens_of_minutes}${time.minutes}:${time.tens_of_seconds}${time.seconds}`
    })

    console.log(this.channel.room_name)

    const response = await axios.get(
      `${location.protocol}//${location.hostname}:1444/getState`,
      {
        params: {
          room_name: this.channel.room_name,
        },
      }
    )

    this.background = this.add
      .image(0, 0, "grass")
      .setOrigin(0)
      .setDisplaySize(this.GW, this.GH)

    const data_state = response.data.state

    // const server_game_time = data_state.game_state.time;

    this.court_config = data_state.court_config

    // TimeManager.startMeasureTime(this,data_state.game_state.time,DOM.time);
    this.score = data_state.game_state.score
    // const time_difference = Date.now() - data_state.game_state.global_time
    // let seconds_difference = parseInt(time_difference/1000);

    /*
while(server_game_time.seconds + seconds_difference >= 60){
  server_game_time.minutes += 1;
  seconds_difference -= 60;
}

if(server_game_time.seconds + seconds_difference >= 60){
  server_game_time.minutes += 1;
  seconds_difference -= 60;
}else{
  server_game_time.seconds += seconds_difference
}

*/

    this.field_type = data_state.game_state.field_type

    this.fieldConfig = this.court_config[this.field_type]
    this.keyboard_manager = new KeyboardManager(this)
    this.field_manager = new FieldManager(this)
    this.field_manager.createCourtLines()
    this.field = this.field_manager.getField()

    this.server_difference_x = this.field.x - this.field.halfWidth
    this.server_difference_y = this.field.y - this.field.halfHeight

    this.GoalElementsManager = new GoalElementsManager(this)
    this.GoalElementsManager.createLeftGoal(
      this.field.x - this.field.halfWidth,
      this.field.y
    )
    this.GoalElementsManager.createRightGoal(
      this.field.x + this.field.halfWidth,
      this.field.y
    )

    this.handleUpdates(data_state.players_state)

    this.ball = new Ball(
      this,
      data_state.ball_state.x + this.server_difference_x,
      data_state.ball_state.y + this.server_difference_y,
      "ball_1"
    )

    this.channel.emit("addPlayer")

    this.state_fetched = true
  }

  update() {
    if (!this.state_fetched) return

    this.keyboard_manager.checkCursorsUpdate()
  }

  handleUpdates(updates) {
    if (updates.length === 0) return

    const players_keys = Object.keys(this.players)

    updates.forEach((player) => {
      const { player_id, x, y, shoot } = player

      if (players_keys.includes(player_id.toString())) {
        const player = this.players[player_id]

        player.setPosition(
          x + this.server_difference_x,
          y + this.server_difference_y
        )
        // player.ring.setPosition(player.x, player.y)
        // player.body.setPosition(player.x, player.y)

        if (shoot) {
          player.shoot()
        } else {
          player.stopShoot()
        }
      } else {
        this.players[player_id] = new Player(
          this,
          x + this.server_difference_x,
          y + this.server_difference_y,
          "red",
          classesProperties.basic
        )
      }
    })
  }

  goalScore(side) {
    if (this.goal_just_shot) return

    this.goal_just_shot = true

    if (side === "left") {
      this.createTextSlide("red", "scores!")
      this.score.red++
    } else {
      this.score.blue++
      this.createTextSlide("blue", "scores!")
    }

    DOM.score.innerHTML = `${this.score.red}:${this.score.blue}`
    TimeManager.stopMeasureTime()

    setTimeout(() => this.handleGoalScored(), 1000)
  }

  handleGoalScored() {
    if (this.is_draw) {
      if (this.score.red > this.score.blue) {
        this.createTextSlide(textConfig.red_won, "test!")
      } else {
        this.createTextSlide(textConfig.blue_won, "test!")
      }
    }

    if (this.score.blue === this.court_config.score_to_win) {
      this.createTextSlide(textConfig.blue_won, "test!")
    } else if (this.score.red === this.court_config.score_to_win) {
      this.createTextSlide(textConfig.red_won, "test!")
    } else {
      this.scene.restart()
    }
  }

  timeOut() {
    if (this.score.red > this.score.blue) {
      this.createTextSlide(textConfig.red_won, "test!")
    } else if (this.score.blue > this.score.red) {
      this.createTextSlide(textConfig.blue_won, "test!")
    } else {
      this.createTextSlide(textConfig.draw, "test!")
      this.is_draw = true
    }
  }

  createTextSlide($text_1, $text_2, color) {
    const text_1 = this.add.text(this.GW / 2 - 150, this.GH / 2 - 50, $text_1, {
      font: "30px Arial",
    })
    const text_2 = this.add.text(this.GW / 2 - 150, this.GH / 2 + 50, $text_2, {
      font: "30px Arial",
    })

    this.tweens.add({
      x: this.GW / 2,
      duration: 300,
      targets: [text_1, text_2],
    })
  }

  updateBounds() {
    this.player_bounds = {
      left:
        this.field.x -
        this.field.displayWidth / 2 -
        this.fieldConfig.goal_width -
        this.court_config.additional_bounds_space,
      right:
        this.field.x +
        this.field.displayWidth / 2 +
        this.fieldConfig.goal_width +
        this.court_config.additional_bounds_space,
      down:
        this.field.y +
        this.field.displayHeight / 2 +
        this.court_config.additional_bounds_space,
      up:
        this.field.y -
        this.field.displayHeight / 2 -
        this.court_config.additional_bounds_space,
    }

    // TODO - repair bounds
    this.cameras.main.setBounds(
      0,
      0,
      this.player_bounds.right - this.player_bounds.left,
      this.GH,
      false
    )
  }

  updateElementsPosition(difference) {
    /*
const bounds_width = this.player_bounds.right.x - this.player_bounds.left.x
let background_bounds_width;
if(gameWidth < bounds_width){
 background_bounds_width = bounds_width
}else{
 background_bounds_width = gameWidth;
}
this.background.setDisplaySize(background_bounds_width,gameHeight)
*/
    this.server_difference_x += difference

    this.ball.x += difference
    /*
    for(const player in this.players){
      this.players[player].x += difference
      this.players[player].ring.x += difference
    }
    */

    //this.players[player].x += difference

    this.field_manager.centerElements()

    this.GoalElementsManager.updateElementsPosition(difference, {
      left: {
        x: this.field.x - this.field.displayWidth * 0.5,
        y: this.field.y,
      },
      right: {
        x: this.field.x + this.field.displayWidth * 0.5,
        y: this.field.y,
      },
    })

    // this.updateBounds()
  }
}
