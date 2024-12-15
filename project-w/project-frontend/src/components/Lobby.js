import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import { useLocation } from 'react-router-dom';
import './styles/Lobby.css';

// Connetti il frontend al server Socket.io
const socket = io('http://localhost:5000');

const Lobby = () => {
    const location = useLocation(); // Ottieni i dati passati tramite state
    const { username, avatar } = location.state || {}; // Ottieni username e avatar

    // Stato per i giocatori collegati
    const [playersInLobby, setPlayersInLobby] = useState([]);

    // Lista dei minigiochi disponibili
    const miniGames = [
        { name: "Minigioco 1", icon: "🎮" },
        { name: "Minigioco 2", icon: "⚽" },
        { name: "Minigioco 3", icon: "🏀" },
        { name: "Minigioco 4", icon: "🏎️" },
    ];

    // Funzione per gestire la connessione e ascoltare i giocatori
    useEffect(() => {
        // Ascolta gli aggiornamenti sui giocatori
        socket.on('updatePlayers', (players) => {
            setPlayersInLobby(players); // Aggiorna la lista dei giocatori
        });

        // Pulizia quando il componente viene smontato
        return () => {
            socket.off('updatePlayers');
        };
    }, []);

    // Funzione per gestire il click sul bottone Invita
    const handleInviteClick = () => {
        alert("Invito inviato!");
    };

    return (
        <div className="lobby-container">
            <div className="lobby-left-sidebar">
                <h3>Giocatori nella lobby</h3>
                <ul className="players-list">
                    {playersInLobby.map((player, index) => (
                        <li key={index} className="player-item">
                            <span className="player-avatar">{player.avatar}</span> {player.name}
                        </li>
                    ))}
                </ul>

                {/* Bottone Invita */}
                <button className="invite-button" onClick={handleInviteClick}>Invita</button>
            </div>

            <div className="lobby-main-content">
                <h1>Benvenuto nella tua lobby, {username}!</h1>

                {/* Box dei minigiochi */}
                <div className="minigames-box">
                    <h2>Minigiochi disponibili</h2>
                    <div className="minigames-container">
                        {miniGames.map((game, index) => (
                            <div key={index} className="minigame-card">
                                <span className="game-icon">{game.icon}</span>
                                <p className="game-name">{game.name}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Lobby;
