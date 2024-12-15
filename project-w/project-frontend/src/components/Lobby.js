
import React, { useEffect, useState } from 'react';

import io from 'socket.io-client';

import { useLocation } from 'react-router-dom';

import './styles/Lobby.css';



const socket = io('http://localhost:5000');



const Lobby = () => {

    const location = useLocation();

    const { username, avatar } = location.state || {};



    const [playersInLobby, setPlayersInLobby] = useState([]);
    const [lobbyCode, setLobbyCode] = useState('');



    // Lista dei minigiochi disponibili

    const miniGames = [

        { name: "Minigioco 1", icon: "🎮" },

        { name: "Minigioco 2", icon: "⚽" },

        { name: "Minigioco 3", icon: "🏀" },

        { name: "Minigioco 4", icon: "🏎️" },

    ];

    useEffect(() => {

        if (username && avatar) {

            socket.emit('joinLobby', { name: username, avatar });

        }



        // Ascolta gli aggiornamenti sui giocatori

        socket.on('updatePlayers', (players) => {

            setPlayersInLobby(players); // Aggiorna la lista dei giocatori

        });



        socket.on('lobbyCode', (code) => {

            setLobbyCode(code); // Ricevi il codice della lobby

        });



        return () => {

            socket.off('updatePlayers');

            socket.off('lobbyCode');

        };

    }, [username, avatar]); // Si attiva solo quando username o avatar cambiano

    // Funzione per gestire il click sul bottone Invita

    const handleInviteClick = () => {
        if (!lobbyCode) {
            alert('Errore: il codice della lobby non è ancora disponibile.');
            return;
        }

        const inviteLink = `${window.location.origin}/join?code=${lobbyCode}`;
        navigator.clipboard.writeText(inviteLink)
            .then(() => alert(`Link copiato negli appunti: ${inviteLink}`))
            .catch(() => alert('Impossibile copiare il link.'));
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

                <button className="invite-button" onClick={handleInviteClick}>Invita</button>

                {lobbyCode && (
                    <p className="lobby-code-display">Codice Lobby: {lobbyCode}</p>
                )}
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