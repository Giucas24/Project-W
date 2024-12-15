const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

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

// Lista di giocatori (memorizzata nel server)
let players = [];

// Gestione delle connessioni dei client
io.on('connection', (socket) => {
    console.log('Nuovo giocatore connesso:', socket.id);

    // Gestisci l'evento quando un giocatore si unisce alla lobby
    socket.on('joinLobby', (player) => {
        // Controlla se il giocatore è già nella lista (in base al nome, avatar o socket.id)
        const playerExists = players.some(p => p.name === player.name && p.avatar === player.avatar);

        if (!playerExists) {
            // Se il giocatore non è già nella lista, aggiungilo
            players.push({ ...player, id: socket.id });
            console.log('Giocatori nella lobby:', players);

            // Invia la lista aggiornata a tutti i client
            io.emit('updatePlayers', players);
        }
    });

    // Gestisci la disconnessione del giocatore
    socket.on('disconnect', () => {
        console.log('Giocatore disconnesso:', socket.id);
        // Rimuovi il giocatore dalla lista
        players = players.filter(player => player.id !== socket.id);
        io.emit('updatePlayers', players); // Invia la lista aggiornata
    });
});


// Avvia il server
server.listen(5000, () => {
    console.log('Server in ascolto sulla porta 5000');
});
