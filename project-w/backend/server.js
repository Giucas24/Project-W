const express = require("express");
const cors = require("cors");
const http = require("http"); // Importa il modulo http per usare Socket.IO
const { Server } = require("socket.io");

const app = express();
app.use(cors());
app.use(express.json());

// Creiamo un server HTTP e lo passiamo a Socket.IO
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "*", // Consenti accessi dal frontend
        methods: ["GET", "POST"],
    },
});

let lobbies = {}; // Salva le lobby e i giocatori

// Crea una lobby
app.post("/create-lobby", (req, res) => {
    const { playerName, avatar } = req.body;
    const lobbyId = Math.random().toString(36).substr(2, 6); // ID univoco della lobby
    lobbies[lobbyId] = [{ playerName, avatar }];
    res.json({ lobbyId });
});

// Ottieni informazioni su una lobby
app.get("/lobby/:id", (req, res) => {
    const { id } = req.params;
    const lobby = lobbies[id];
    if (!lobby) return res.status(404).json({ error: "Lobby not found" });
    res.json({ players: lobby });
});

// Aggiungi un giocatore a una lobby
app.post("/lobby/:id/join", (req, res) => {
    const { id } = req.params;
    const { playerName, avatar } = req.body;
    if (!lobbies[id]) return res.status(404).json({ error: "Lobby not found" });
    lobbies[id].push({ playerName, avatar });

    // Notifica tutti i client connessi alla lobby
    io.to(id).emit("playerJoined", lobbies[id]);

    res.json({ success: true, players: lobbies[id] });
});

// Gestione connessioni Socket.IO
io.on("connection", (socket) => {
    console.log("Un client si è connesso");

    socket.on("joinLobby", (lobbyId) => {
        socket.join(lobbyId); // Unisce il client alla stanza della lobby
        console.log(`Client unito alla lobby ${lobbyId}`);
    });

    socket.on("disconnect", () => {
        console.log("Un client si è disconnesso");
    });
});

const PORT = 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
