import axios from "axios"
import { createElementFromHTML, createLobbyUserDiv } from "../dom/domFunctions"

export default class RoomsHandler {
  constructor(channel) {
    this.channel = channel
  }

  getRooms() {
    this.channel.onConnect((error) => {
      if (error) console.error(error.message)

      axios
        .get(`${location.protocol}//${location.hostname}:1444/getRooms`)
        .then((response) => {
          const { rooms } = response.data

          rooms.forEach((room) => {
            const text = `${room.name}, ${room.lobby.length}/${room.max_players}`
            $(ROOMS_LIST).append(createElementFromHTML(`<div>${text}</div>`))
          })
        })
        .catch((e) => console.log(e))
    })
  }

  handleInRoomSockets() {
    this.channel.on("newPlayerInLobby", () => createLobbyUserDiv())

    this.channel.on("getPlayersInLobby", (data) => {
      data.forEach((player) => createLobbyUserDiv(player.team))
    })
  }

  joinRoom(data) {
    this.channel.emit("joinRoom", data)
  }
}
