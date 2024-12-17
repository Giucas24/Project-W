import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Home.css"; // Importa il file CSS esterno

function Home() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("🙂"); // Default avatar
    const [showAvatarPanel, setShowAvatarPanel] = useState(false); // Stato per mostrare il pannello avatar
    const navigate = useNavigate();

    const createLobby = async () => {
        if (!name) {
            alert("Inserisci un nome!");
            return;
        }
        const response = await fetch("http://localhost:5000/create-lobby", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ playerName: name, avatar }),
        });
        const data = await response.json();
        navigate(`/lobby/${data.lobbyId}`);
    };

    const avatars = ["🙂", "😎", "🤩", "🥳", "🤖", "👾"]; // Lista avatar

    return (
        <div className="home-container">
            <h1 className="home-title">Project-W</h1>
            <div className="home-form">
                <input
                    type="text"
                    placeholder="Inserisci il tuo nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="home-input"
                />
                <div className="avatar-selection">
                    <label>Scegli un avatar:</label>
                    <button
                        className="avatar-button"
                        onClick={() => setShowAvatarPanel(!showAvatarPanel)}
                    >
                        {avatar}
                    </button>
                    {showAvatarPanel && (
                        <div className="avatar-panel">
                            {avatars.map((av, index) => (
                                <button
                                    key={index}
                                    className={`avatar-option ${avatar === av ? "selected" : ""}`}
                                    onClick={() => {
                                        setAvatar(av);
                                        setShowAvatarPanel(false); // Chiude il pannello
                                    }}
                                >
                                    {av}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
                <button onClick={createLobby} className="home-button">
                    Crea lobby privata
                </button>
            </div>
        </div>
    );
}

export default Home;
