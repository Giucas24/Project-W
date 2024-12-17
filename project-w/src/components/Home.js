import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Home() {
    const [name, setName] = useState("");
    const [avatar, setAvatar] = useState("🙂"); // Default avatar
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

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>Project-W</h1>
            <div style={{ margin: "20px auto", width: "300px" }}>
                <input
                    type="text"
                    placeholder="Inserisci il tuo nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    style={{ width: "100%", padding: "10px" }}
                />
                <div style={{ marginTop: "20px" }}>
                    <label>Scegli un avatar:</label>
                    <select
                        value={avatar}
                        onChange={(e) => setAvatar(e.target.value)}
                        style={{ marginLeft: "10px" }}
                    >
                        <option value="🙂">🙂</option>
                        <option value="😎">😎</option>
                        <option value="🤩">🤩</option>
                        <option value="🥳">🥳</option>
                    </select>
                </div>
                <button
                    onClick={createLobby}
                    style={{
                        marginTop: "20px",
                        padding: "10px 20px",
                        backgroundColor: "#007BFF",
                        color: "#fff",
                        border: "none",
                        cursor: "pointer",
                    }}
                >
                    Crea lobby privata
                </button>
            </div>
        </div>
    );
}

export default Home;
