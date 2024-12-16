const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');
const { v4: uuidv4 } = require('uuid'); // Per generare codici univoci

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
    },
    transports: ['websocket'], // Limita ai soli WebSocket
});

// Lista di giocatori e lobby
let players = [];
let lobbies = {}; // Mappa codiceLobby -> listaGiocatori
let sessions = {}; // Mappa sessionId -> socketId

// Gestione delle connessioni dei client
io.on('connection', (socket) => {
    console.log('Nuovo giocatore connesso:', socket.id, 'Transport:', socket.conn.transport.name, 'Query:', socket.handshake.query);

    // Recupera o genera un nuovo sessionId
    let sessionId = socket.handshake.query.sessionId;
    if (!sessionId || sessionId === 'null') {
        // Disconnetti connessioni "sospette" senza un sessionId valido
        console.log('Connessione senza sessionId, disconnessione:', socket.id);
        socket.disconnect();
        return;
    }

    // Associa il sessionId al socket.id
    sessions[sessionId] = socket.id;

    // Gestisci l'evento quando un giocatore si unisce alla lobby
    socket.on('joinLobby', ({ name, avatar, code }) => {
        let lobbyCode = code || uuidv4().slice(0, 6).toUpperCase(); // Genera codice univoco

        // Crea o aggiorna la lobby
        if (!lobbies[lobbyCode]) {
            lobbies[lobbyCode] = [];
        }

        const playerExists = lobbies[lobbyCode].some(p => p.sessionId === sessionId);

        if (!playerExists) {
            lobbies[lobbyCode].push({ id: socket.id, sessionId, name, avatar });
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

        // Rimuovi il socketId dalla mappa delle sessioni
        for (const [key, value] of Object.entries(sessions)) {
            if (value === socket.id) delete sessions[key];
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
