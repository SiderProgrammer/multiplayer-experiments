import * as functions from "./domFunctions"
import {
  TIMER,
  SCORE,
  MAP_SELECT_BUTTON,
  LOBBY_BUTTON,
  START_GAME_BUTTON,
  GAME_RESUME_BUTTON,
  LOBBY_CONTAINER,
  GAME_CANVAS_CONTAINER,
  MAPS_CONTAINER,
  MAIN_CONTAINER,
  SEND_MESSAGE_BUTTON,
  MESSAGES_CONTAINER,
  CHAT_ELEMENTS_CONTAINER,
  CHAT_INPUT,
} from "./static"

const DOM = {
  elements: {},

  bindGameElements() {
    const { $ } = functions

    this.elements.time = $(TIMER)
    this.elements.score = $(SCORE)
    this.elements.mapSelectButt = $(MAP_SELECT_BUTTON)
    this.elements.lobbyButt = $(LOBBY_BUTTON)
    this.elements.startGameButt = $(START_GAME_BUTTON)
    this.elements.gameResumeButt = $(GAME_RESUME_BUTTON)
    this.elements.lobbyDiv = $(LOBBY_CONTAINER)
    this.elements.gameDiv = $(GAME_CANVAS_CONTAINER)
    this.elements.mapsDiv = $(MAPS_CONTAINER)
    this.elements.gameContainer = $(MAIN_CONTAINER)
    this.elements.sendMessageButton = $(SEND_MESSAGE_BUTTON)
    this.elements.messagesContainer = $(MESSAGES_CONTAINER)
    this.elements.chatElementsContainer = $(CHAT_ELEMENTS_CONTAINER)
    this.elements.chatInput = $(CHAT_INPUT)
    console.log(START_GAME_BUTTON, this.elements.startGameButt)
  },

  bindListeners(game) {
    this.elements.mapsDiv.children[0].addEventListener("click", () =>
      functions.setCourtSize("huge", game)
    )
    this.elements.mapsDiv.children[1].addEventListener("click", () =>
      functions.setCourtSize("small", game)
    )
    this.elements.mapSelectButt.addEventListener(
      "click",
      functions.showMapSelector
    )
    this.elements.lobbyButt.addEventListener("click", functions.startLobby)
    this.elements.startGameButt.addEventListener("click", functions.startGame)
    this.elements.gameResumeButt.addEventListener("click", functions.showGame)

    this.elements.sendMessageButton.addEventListener("click", () =>
      functions.handleMessage({
        to_emit: true,
        message: this.elements.chatInput.value,
      })
    )
  },
}

const DOM_elements = DOM.elements

export { DOM, DOM_elements }
