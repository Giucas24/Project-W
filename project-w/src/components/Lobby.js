import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { io } from "socket.io-client";
import "./styles/Lobby.css";

function Lobby() {
    const { id } = useParams();
    const [players, setPlayers] = useState([]);
    const [minigames] = useState(["Minigioco 1", "Minigioco 2", "Minigioco 3"]);

    useEffect(() => {
        const fetchLobby = async () => {
            const response = await fetch(`http://localhost:5000/lobby/${id}`);
            const data = await response.json();
            setPlayers(data.players);
        };
        fetchLobby();

        // Connetti al server Socket.IO
        const socket = io("http://localhost:5000");
        socket.emit("joinLobby", id); // Unisciti alla stanza della lobby

        // Ascolta gli aggiornamenti quando un giocatore si unisce
        socket.on("playerJoined", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        return () => {
            socket.disconnect(); // Disconnetti alla chiusura del componente
        };
    }, [id]);

    const inviteLink = `${window.location.origin}/join-lobby/${id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            alert("Link copiato negli appunti! Condividilo per invitare altri giocatori.");
        }).catch(err => {
            console.error("Errore nella copia del link:", err);
            alert("Errore nella copia del link.");
        });
    };

    return (
        <div className="lobby-container">
            {/* Sidebar */}
            <div className="sidebar">
                <h3>Giocatori</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            {player.avatar} {player.playerName}
                        </li>
                    ))}
                </ul>
                {/* Pulsante Invita */}
                <button onClick={copyToClipboard}>Invita</button>
            </div>

            {/* Minigiochi */}
            <div className="minigames">
                <h3>Minigiochi</h3>
                <div>
                    {minigames.map((game, index) => (
                        <button key={index}>{game}</button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Lobby;
