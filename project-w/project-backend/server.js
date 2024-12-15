const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Abilita CORS per permettere le richieste da http://localhost:3000 (frontend React)
app.use(cors({
    origin: 'http://localhost:3000', // Puoi cambiare questa URL in base alla tua configurazione
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type']
}));

// Lista di giocatori (memorizzata nel server)
let players = [];

// Gestione delle connessioni dei client
io.on('connection', (socket) => {
    console.log('Nuovo giocatore connesso:', socket.id);

    // Gestisci l'evento quando un giocatore si unisce alla lobby
    socket.on('joinLobby', (player) => {
        // Aggiungi il giocatore alla lista
        players.push({ ...player, id: socket.id });
        console.log('Giocatori nella lobby:', players);

        // Invia la lista aggiornata a tutti i client
        io.emit('updatePlayers', players);
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
