export default function (game_width, game_height) {
  return {
    type: Phaser.CANVAS,
    parent: "game",
    enableDebug: false,

    width: game_width,
    height: game_height,

    scale: {
      mode: Phaser.Scale.NONE,
    },

    physics: {
      default: "matter",
    },

    render: {
      clearBeforeRender: false,
    },
    /*
          physics: {
            default: 'matter',
            matter: {
                debug: true
            }
        },
    */
  }
}
