import React from "react";
import { useParams } from "react-router-dom";

function Minigame() {
    const { game } = useParams();

    return (
        <div style={{ textAlign: "center", marginTop: "50px" }}>
            <h1>{game}</h1>
            <p>Benvenuti al minigioco!</p>
        </div>
    );
}

export default Minigame;
