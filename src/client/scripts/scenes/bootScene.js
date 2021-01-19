export default class BootScene extends Phaser.Scene {
  constructor() {
    super("BootScene")
  }

  init({ channel }) {
    this.channel = channel
  }

  preload() {
    this.load.image("grass", `assets/backgrounds/grass.png`)
    this.load.image("field", `assets/backgrounds/field.png`)
    this.load.image("skin_1", `assets/skins/skin_1.png`)
    this.load.image("ball_1", `assets/skins/ball_1.png`)
    this.load.image("post", `assets/post.png`)
    this.load.image("net", `assets/net.png`)
    this.load.image("square", `assets/square.png`)
    this.load.image("circle", `assets/circle.png`)

    this.ready = false
    this.channel.on("ready", () => {
      console.log("ready!")
      this.ready = true
    })
  }

  // use phaser function instead of checking update
  update() {
    if (!this.ready) return
    this.scene.start("GameScene")
    this.ready = false
  }
}
