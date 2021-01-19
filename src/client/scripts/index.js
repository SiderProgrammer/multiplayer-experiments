import geckos from "@geckos.io/client"
import { DOM } from "./dom/domElements"
import createPhaserGame from "./game"
import { getGameSize, $ } from "./dom/domFunctions"
import RoomsHandler from "./handlers/roomsHandler"

import {
  CREATE_ROOM_BUTTON,
  ROOMS_CONTAINER,
  CREATE_ROOM_BUTTON_CONFIRM,
  ROOM_NAME_INPUT,
  ROOM_MAX_PLAYERS,
  ROOM_CREATOR,
  MAIN_CONTAINER,
  MAIN_VIEW,
  game_lobby_div,
  game_div,
  chat_div,
  room_creator_div,
} from "./dom/static"

const channel = geckos({ port: 1444 })
const roomsHandler = new RoomsHandler(channel)

window.addEventListener("load", () => {
  roomsHandler.getRooms() // TODO - ROOMS DONT SHOW ?

  $(CREATE_ROOM_BUTTON).addEventListener("click", () => {
    $(ROOMS_CONTAINER).replaceWith(room_creator_div)
    $(CREATE_ROOM_BUTTON_CONFIRM).addEventListener("click", makeNewGame)
  })
})

function makeNewGame() {
  roomsHandler.handleInRoomSockets()

  channel.room_name = $(ROOM_NAME_INPUT).value

  roomsHandler.joinRoom({
    room_name: channel.room_name,
    max_players: ROOM_MAX_PLAYERS.value,
    colors: [],
  })

  $(ROOM_CREATOR).replaceWith(game_lobby_div)
  $(MAIN_CONTAINER).append(game_div)
  $(MAIN_VIEW).append(chat_div)

  DOM.bindGameElements()

  const { game_width, game_height } = getGameSize()

  const game = createPhaserGame(channel, game_width, game_height)
  game.old_width = game_width

  DOM.bindListeners(game)
}
