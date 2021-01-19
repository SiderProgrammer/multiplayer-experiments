const config = require("../game/config")
const GameScene = require("../game/gameScene")

module.exports = class RoomsManager {
  constructor(io) {
    this.io = io
    this.rooms = []
  }

  addUser(channel, data) {
    channel.join(data.room_name)

    if (!this.rooms.find((room) => room.name === data.room_name)) {
      const game = new Phaser.Game(config)
      // split creating phaser instance to other file
      game.scene.add("GameScene", GameScene, true, {
        io: this.io,
        room_name: data.room_name,
      })

      console.log("new room")

      this.rooms.push({
        name: data.room_name,
        max_players: data.max_players,
        game_scene: game.scene.keys.GameScene,
        lobby: [],
      })
    }

    const room = this.rooms.find((room) => room.name === data.room_name)

    room.game_scene.bindServerFunctions(channel)

    room.lobby.push({
      id: channel.id,
      team: "spectators",
    })

    channel.emit("getPlayersInLobby", room.lobby)
    channel.broadcast.emit(
      "newPlayerInLobby",
      room.lobby[room.lobby.length - 1]
    )
  }

  getRoomGameState(req, res) {
    this.rooms.forEach((room) => {
      if (room.name === req.query.room_name) {
        return res.json({ state: room.game_scene.getState() })
      }
    })
  }

  getRooms(res) {
    const rooms_data = this.rooms.filter((room) => delete room.game_scene)
    res.json({ rooms: rooms_data })
  }
}
