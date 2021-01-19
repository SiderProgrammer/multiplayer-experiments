require("@geckos.io/phaser-on-nodejs")

const Phaser = require("phaser")

const config = {
  type: Phaser.HEADLESS,
  parent: "phaser-game",

  width: 800,
  height: 500,

  render: {
    clearBeforeRender: false,
  },

  physics: {
    default: "matter",
  },
}
module.exports = config
