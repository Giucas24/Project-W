import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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
        <div style={{ display: "flex", height: "100vh" }}>
            {/* Sidebar */}
            <div style={{ width: "30%", borderRight: "1px solid #ccc", padding: "20px" }}>
                <h3>Giocatori</h3>
                <ul>
                    {players.map((player, index) => (
                        <li key={index}>
                            {player.avatar} {player.playerName}
                        </li>
                    ))}
                </ul>
                {/* Pulsante Invita */}
                <button
                    onClick={copyToClipboard}
                    style={{
                        marginTop: "20px",
                        padding: "10px 15px",
                        cursor: "pointer",
                        backgroundColor: "#4CAF50",
                        color: "white",
                        border: "none",
                        borderRadius: "5px",
                    }}
                >
                    Invita
                </button>
            </div>

            {/* Minigiochi */}
            <div style={{ flex: 1, padding: "20px", textAlign: "center" }}>
                <h3>Minigiochi</h3>
                <div>
                    {minigames.map((game, index) => (
                        <button
                            key={index}
                            style={{
                                display: "block",
                                margin: "10px auto",
                                padding: "10px 20px",
                                cursor: "pointer",
                            }}
                        >
                            {game}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Lobby;
