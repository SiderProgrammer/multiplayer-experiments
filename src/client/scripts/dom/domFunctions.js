import { DOM_elements } from "./domElements"

import { IN_ROOM_TEAMS_LIST } from "./static"

export function $(el, display_style = "block") {
  const binded_el = document.querySelectorAll(el)
  if (binded_el.length > 1) return binded_el

  binded_el[0].show = function () {
    binded_el[0].style.display = display_style
  }

  binded_el[0].hide = function () {
    binded_el[0].style.display = "none"
  }

  return binded_el[0]
}

export function createElementFromHTML(htmlString) {
  const div = document.createElement("div")
  div.innerHTML = htmlString.trim()
  return div.firstChild
}

export function startGame() {
  DOM_elements.startGameButt.hide()
  DOM_elements.gameResumeButt.show()
  showGame()
}

export function setCourtSize(type, game) {
  hideMapSelector()
  config.field_type = type
  game.scene.getScene("GameScene").scene.restart()
}

export function startLobby() {
  DOM_elements.lobbyDiv.show()
}

export function showGame() {
  DOM_elements.gameDiv.show()
  DOM_elements.lobbyDiv.hide()
}

export function showMapSelector() {
  DOM_elements.mapsDiv.show()
}

export function hideMapSelector() {
  DOM_elements.mapsDiv.hide()
}

export function getGameSize() {
  return {
    game_width: DOM_elements.gameContainer.offsetWidth,
    game_height: DOM_elements.gameContainer.offsetHeight,
  }
}

export function createLobbyUserDiv(team) {
  let numb = 1
  // eslint-disable-next-line default-case
  switch (team) {
    case "red":
      numb = 0
      break
    case "blue":
      numb = 2
      break
  }

  const player_div = "<span style='color:red';> New player </span>"
  $(IN_ROOM_TEAMS_LIST)[numb].insertAdjacentHTML("beforeend", player_div)
}

/*
 export function handleMessage(config){
  const message = config.message;
  if(message === "") return;

  const element_message = `<span>${message}</span>`
  DOM_elements.messagesContainer.insertAdjacentHTML("beforeend",element_message)
  DOM_elements.chatElementsContainer
  .scrollTo(0,DOM_elements.chatElementsContainer.scrollHeight)

   DOM_elements.chatInput.value = "";
if(config.to_emit) socket.emit("chatMessage",message)
}

*/
