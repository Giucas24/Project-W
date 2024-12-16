import { io } from 'socket.io-client';

const SOCKET_URL = 'http://localhost:5000';

// Recupera il sessionId dal localStorage o genera uno nuovo
let sessionId = localStorage.getItem('sessionId');
if (!sessionId) {
    sessionId = null; // Sarà generato dal server
}

// Crea la connessione una sola volta, forzando il trasporto WebSocket
console.log('Inizializzo Socket.IO...');
const socket = io(SOCKET_URL, {
    query: { sessionId },
    transports: ['websocket'], // Forza l'uso del WebSocket
});

console.log('Socket.IO Connesso:', socket.id);

// Salva il sessionId quando viene assegnato dal server
socket.on('assignSessionId', (id) => {
    sessionId = id;
    localStorage.setItem('sessionId', id);
});

export default socket;
