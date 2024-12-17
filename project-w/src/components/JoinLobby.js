import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

const JoinLobby = () => {
    const { id } = useParams(); // Ottieni l'ID della lobby dal link
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("🙂"); // Emoji di default
    const navigate = useNavigate();

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
        <div className="join-lobby">
            <h1>Unisciti alla Lobby</h1>
            <div>
                <label>
                    Nome:
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </label>
            </div>
            <div>
                <label>
                    Avatar:
                    <select value={avatar} onChange={(e) => setAvatar(e.target.value)}>
                        <option value="🙂">🙂</option>
                        <option value="😎">😎</option>
                        <option value="🤖">🤖</option>
                        <option value="👾">👾</option>
                    </select>
                </label>
            </div>
            <button onClick={joinLobby}>Unisciti</button>
        </div>
    );
};

export default JoinLobby;
