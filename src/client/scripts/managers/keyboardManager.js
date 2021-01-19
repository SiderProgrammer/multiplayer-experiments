export default class KeyboardManager {
  constructor(scene) {
    this.zoom_values = {
      max: 2,
      medium: 1.5,
      normal: 1,
    }

    this.scene = scene
    this.camera = scene.cameras.main

    this.cursors = this.scene.input.keyboard.createCursorKeys()
    this.bindKeys()
  }

  bindKeys() {
    this.bindZoomKeys()
    this.bindShootKey()
  }

  bindShootKey() {
    this.cursors.space = this.scene.input.keyboard
      .addKey("SPACE")
      .on("down", () => this.scene.channel.emit("changeShoot", true))
      .on("up", () => this.scene.channel.emit("changeShoot", false))
  }

  bindZoomKeys() {
    const operateCamera = (value, camFollow = false) => {
      this.camera.setZoom(value)
      if (camFollow)
        this.camera.startFollow(
          this.scene.players[this.scene.my_id],
          false,
          0.1,
          0.1
        )
      else {
        this.camera.stopFollow()
        this.camera.centerOn(this.scene.GW / 2, this.scene.GH / 2)
      }
    }

    const numericKeys = this.scene.input.keyboard.addKeys("ONE,TWO,THREE")
    numericKeys.ONE.on("down", () => operateCamera(this.zoom_values.normal))
    numericKeys.TWO.on("down", () =>
      operateCamera(this.zoom_values.medium, true)
    )

    numericKeys.THREE.on("down", () =>
      operateCamera(this.zoom_values.max, true)
    )
  }

  checkCursorsUpdate() {
    const move = {}

    if (this.cursors.left.isDown) {
      move.left = true
    } else if (this.cursors.right.isDown) {
      move.right = true
    }

    if (this.cursors.up.isDown) {
      move.up = true
    } else if (this.cursors.down.isDown) {
      move.down = true
    }
    //move.date = new Date.now()
    //check if move is empty
    if (!Object.keys(move).length) return
    this.scene.players[this.scene.my_id].updatePosition(move)
    this.scene.channel.emit("playerMove", move)
  }
}
