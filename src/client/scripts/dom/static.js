import templates from "../templates"
import { createElementFromHTML } from "../dom/domFunctions"

const SELECTOR = "data-hook" // static data selector
const bindDataElement = (data_value) => {
  return `[${SELECTOR}=${data_value}]`
}

export const CREATE_ROOM_BUTTON = bindDataElement("create-room")
export const CREATE_ROOM_BUTTON_CONFIRM = bindDataElement("create-room-confirm")
export const ROOM_NAME_INPUT = bindDataElement("room-name")
export const ROOM_MAX_PLAYERS = bindDataElement("max-players")
export const TIMER = bindDataElement("time")
export const SCORE = bindDataElement("score")
export const MAP_SELECT_BUTTON = bindDataElement("select-map")
export const LOBBY_BUTTON = bindDataElement("lobby")
export const START_GAME_BUTTON = bindDataElement("start-game")
export const GAME_RESUME_BUTTON = bindDataElement("resume")
export const SEND_MESSAGE_BUTTON = bindDataElement("send-message")

export const MAIN_VIEW = ".view"
export const MAIN_CONTAINER = ".main-container"

export const ROOMS_CONTAINER = ".rooms-container"
export const ROOMS_LIST = ".rooms-list"

export const ROOM_CREATOR = ".room-creator-container"

export const IN_ROOM_TEAMS_LIST = ".team-list"

export const LOBBY_CONTAINER = ".lobby"
export const GAME_CANVAS_CONTAINER = "#game"
export const MAPS_CONTAINER = ".maps-container"

export const MESSAGES_CONTAINER = ".messages-container"
export const CHAT_ELEMENTS_CONTAINER = ".chat-elements-container"
export const CHAT_INPUT = ".chat-input"

export const room_creator_div = createElementFromHTML(templates.room_creator)
export const game_lobby_div = createElementFromHTML(templates.game_lobby)
export const game_div = createElementFromHTML(templates.game)
export const chat_div = createElementFromHTML(templates.chat)
