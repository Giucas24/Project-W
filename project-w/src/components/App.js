import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./Home";
import Lobby from "./Lobby";
import JoinLobby from "./JoinLobby";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/lobby/:id" element={<Lobby />} />
                <Route path="/join-lobby/:id" element={<JoinLobby />} />
            </Routes>
        </Router>
    );
}

export default App;
