import Phaser from "phaser"
import GameScene from "./scenes/gameScene"
import BootScene from "./scenes/bootScene"
import getGameConfig from "./gameConfig"
import getGameSize from "./dom/domFunctions"

function resize(game) {
  const court_scene = game.scene.getScene("GameScene")

  const { game_width, game_height } = getGameSize()

  game.scale.resize(game_width, game_height)

  court_scene.GW = game_width
  court_scene.GH = game_height

  const difference = game_width - game.old_width
  game.old_width = game_width

  court_scene.background.setDisplaySize(game_width, game_height)
  court_scene.updateElementsPosition(difference / 2)
}

function createPhaserGame(channel, game_width, game_height) {
  const game = new Phaser.Game(getGameConfig(game_width, game_height))
  game.scene.add("BootScene", BootScene, true, { channel })

  game.scene.add("GameScene", GameScene, false, {
    channel,
    game_width,
    game_height,
  })

  window.addEventListener("resize", () => resize(game), false)
  // TODO - resize height bug, bottom container run away

  return game
}

export default createPhaserGame
