const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

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
    res.json({ success: true, players: lobbies[id] });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
