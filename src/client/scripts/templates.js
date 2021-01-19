const room_creator = `
<div class ="room-creator-container">
<p>room name:</p>
<input class="room-name" data-hook="room-name" placeholder="type room name">
<p>password:</p>
<input>
<p>max players:</p>
<input class="max-players" data-hook="max-players" value="12">
<p>teams colors:</p>
<div style="text-align: center;display: flex;">
    <div>
        <p>team 1</p>
        <select>
            <option selected>red</option>
            <option>green</option>
        </select>
    </div>
    
    <div>
        <p>team 2</p>
        <select>
            <option selected>blue</option>
            <option>yellow</option>
        </select>
    </div>
</div>
<button class="create-button-confirm" data-hook="create-room-confirm" >join</button>
</div> `

const game_lobby = `
    
<div class="lobby">
    <div class="room" style="display: flex; flex-direction: column;">
        <div class="teams" style="display: flex;justify-content: center;flex: 1;">

            <div class="team-container" style="margin-right:15px">
                <button>red</button>
                <div class="team-list"></div>
            </div>

            <div class="team-container">
                <button>spectator</button>
                <div class="team-list"></div>
            </div>

            <div class="team-container" style="margin-left:15px">
                <button>blue</button>
                <div class="team-list"></div>
            </div>  

        </div>

        <div>
            <button class="start-game-button" data-hook="start-game">Start</button>
            <button class="resume-game-button" data-hook="resume" >Resume</button>
            <button class="select-map-button" data-hook="select-map">Select court</button>
        </div>
        
        <div class="maps-container" data-hook="maps-list-container">
            <button>huge</button>
            <button>small</button>
        </div>
     </div>
 </div>
    `
const game = `<div id="game">
<div class="score-container">
    <span class="score" data-hook="score">0:0</span>
</div>
<span class="time" data-hook="time" >00:00</span>
</div>`

const chat = `<div class="bottom-container">
<button class="lobby-button" data-hook="lobby">Lobby</button>

<div class="chat-elements-container">
   <div class="messages-container"></div>
   <div>
       <input class="chat-input" data-hook="message-value" placeholder="Type text...">
       <button class="send-message-button" data-hook="send-message">Send message</button>
   </div>
   
</div>

</div>
`
export default {
  room_creator,
  game_lobby,
  game,
  chat,
}
