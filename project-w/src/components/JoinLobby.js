import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./styles/JoinLobby.css";

const JoinLobby = () => {
    const { id } = useParams(); // Ottieni l'ID della lobby dal link
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("🙂"); // Emoji di default
    const [isAvatarPanelOpen, setIsAvatarPanelOpen] = useState(false); // Stato per il pannello avatar
    const navigate = useNavigate();

    const avatars = ["🙂", "😎", "🤖", "👾", "🤩", "🥳"]; // Lista avatar disponibili

    const joinLobby = async () => {
        if (!name) {
            alert("Devi inserire un nome!");
            return;
        }
        const response = await fetch(`http://localhost:5000/lobby/${id}/join`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerName: name, avatar }),
        });
        if (response.ok) {
            navigate(`/lobby/${id}`);
        } else {
            alert("Errore durante la connessione alla lobby.");
        }
    };

    return (
        <div className="join-container">
            <h1 className="join-title">Unisciti alla Lobby</h1>
            <div className="join-form">
                {/* Input del nome */}
                <input
                    type="text"
                    placeholder="Inserisci il tuo nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="join-input"
                />

                {/* Selettore avatar */}
                <div className="avatar-selection">
                    <label>Scegli un avatar:</label>
                    <button
                        className="avatar-button"
                        onClick={() => setIsAvatarPanelOpen(!isAvatarPanelOpen)}
                    >
                        {avatar}
                    </button>
                    {isAvatarPanelOpen && (
                        <div className="avatar-panel">
                            {avatars.map((av, index) => (
                                <button
                                    key={index}
                                    className={`avatar-option ${avatar === av ? "selected" : ""}`}
                                    onClick={() => {
                                        setAvatar(av);
                                        setIsAvatarPanelOpen(false); // Chiude il pannello dopo la selezione
                                    }}
                                >
                                    {av}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottone per unirsi alla lobby */}
                <button className="join-button" onClick={joinLobby}>
                    Unisciti
                </button>
            </div>
        </div>
    );
};

export default JoinLobby;
