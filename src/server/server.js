const port = 1444

const express = require("express")
const http = require("http")
const cors = require("cors")
const compression = require("compression")
const path = require("path")

const geckos = require("@geckos.io/server").default
const { iceServers } = require("@geckos.io/server")
const RoomsManager = require("./managers/RoomsManager")

const templates = require("./templates")

const app = express()
const server = http.createServer(app)

const servers = process.env.NODE_ENV === "production" ? iceServers : []

const io = geckos({ iceServers: servers })
io.addServer(server)

const roomsManager = new RoomsManager(io)

io.onConnection((channel) => {
  channel.on("joinRoom", (data) => roomsManager.addUser(channel, data))
})

app.use(cors())
app.use(compression())

app.use("/play", express.static(path.join(__dirname, "../../dist")))
app.use("/play/assets", express.static(path.join(__dirname, "./assets/img")))

app.get("/", (req, res) => res.send(templates.start_page))
app.get("/play", (req, res) =>
  res.sendFile(path.join(__dirname, "../../dist/index.html"))
)
app.get("/getState", (req, res) => roomsManager.getRoomGameState(req, res))
app.get("/getRooms", (req, res) => roomsManager.getRooms(res))

server.listen(port, () => console.log(`Express is listening localhost:${port}`))
