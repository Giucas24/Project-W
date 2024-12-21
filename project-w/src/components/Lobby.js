import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import "./styles/Lobby.css";

function Lobby() {
    const { id } = useParams();
    const navigate = useNavigate(); // Per il redirect
    const [players, setPlayers] = useState([]);
    const [minigames] = useState(["Minigioco 1", "Minigioco 2", "Minigioco 3"]);
    const [socket, setSocket] = useState(null); // Stato per gestire la connessione Socket.IO

    useEffect(() => {
        const fetchLobby = async () => {
            try {
                const response = await fetch(`http://localhost:5000/lobby/${id}`);
                if (response.ok) {
                    const data = await response.json();
                    setPlayers(data.players); // Aggiorna immediatamente la lista dei giocatori
                } else {
                    console.error("Errore nel caricamento della lobby:", await response.json());
                }
            } catch (err) {
                console.error("Errore di rete:", err);
            }
        };
        fetchLobby();

        // Connetti al server Socket.IO
        const newSocket = io("http://localhost:5000");
        setSocket(newSocket);

        newSocket.emit("joinLobby", id); // Unisciti alla stanza della lobby

        // Ascolta gli aggiornamenti quando un giocatore si unisce
        newSocket.on("playerJoined", (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        // Ascolta l'evento per iniziare un minigioco
        newSocket.on("startMinigame", (minigame) => {
            // Cambia pagina verso il minigioco
            navigate(`/minigame/${minigame}`);
        });

        return () => {
            newSocket.disconnect(); // Disconnetti alla chiusura del componente
        };
    }, [id, navigate]);

    const inviteLink = `${window.location.origin}/join-lobby/${id}`;

    const copyToClipboard = () => {
        navigator.clipboard.writeText(inviteLink).then(() => {
            alert("Link copiato negli appunti! Condividilo per invitare altri giocatori.");
        }).catch(err => {
            console.error("Errore nella copia del link:", err);
            alert("Errore nella copia del link.");
        });
    };

    const startMinigame = (game) => {
        if (socket) {
            socket.emit("startMinigame", { lobbyId: id, game });
        } else {
            console.error("Socket non connesso");
        }
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
                        <button key={index} onClick={() => startMinigame(game)}>
                            {game}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Lobby;
