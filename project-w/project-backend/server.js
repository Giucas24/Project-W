// --- Aggiornamenti al backend ---
const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Importa per generare codici univoci

const app = express();
const server = http.createServer(app);

// Configura il CORS per il backend Express
app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Configura il CORS per Socket.IO
const io = socketIo(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
});

// Lista di giocatori e lobby
let players = [];
let lobbies = {}; // Mappa codiceLobby -> listaGiocatori

// Gestione delle connessioni dei client
io.on('connection', (socket) => {
    console.log('Nuovo giocatore connesso:', socket.id);

    // Gestisci l'evento quando un giocatore si unisce alla lobby
    socket.on('joinLobby', ({ name, avatar, code }) => {
        let lobbyCode = code || uuidv4().slice(0, 6).toUpperCase(); // Genera codice univoco

        // Crea o aggiorna la lobby
        if (!lobbies[lobbyCode]) {
            lobbies[lobbyCode] = [];
        }

        const playerExists = lobbies[lobbyCode].some(p => p.name === name && p.avatar === avatar);

        if (!playerExists) {
            lobbies[lobbyCode].push({ id: socket.id, name, avatar });
            console.log(`Lobby ${lobbyCode} giocatori:`, lobbies[lobbyCode]);
        }

        // Unisci il socket alla stanza della lobby
        socket.join(lobbyCode);

        // Invia il codice della lobby al giocatore
        socket.emit('lobbyCode', lobbyCode);

        // Invia l'aggiornamento della lista dei giocatori alla lobby
        io.to(lobbyCode).emit('updatePlayers', lobbies[lobbyCode]); // Invia a tutti i giocatori nella lobby
    });



    // Gestisci la disconnessione del giocatore
    socket.on('disconnect', () => {
        console.log('Giocatore disconnesso:', socket.id);

        // Rimuovi il giocatore da tutte le lobby
        for (const [code, players] of Object.entries(lobbies)) {
            lobbies[code] = players.filter(player => player.id !== socket.id);
            if (lobbies[code].length === 0) delete lobbies[code]; // Elimina lobby vuote
        }

        // Aggiorna le lobby
        Object.keys(lobbies).forEach(code => {
            io.to(code).emit('updatePlayers', lobbies[code]);
        });
    });
});

// Avvia il server
server.listen(5000, () => {
    console.log('Server in ascolto sulla porta 5000');
});