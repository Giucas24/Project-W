import React from 'react';
import { Routes, Route } from 'react-router-dom'; // Importa le rotte
import PlayerForm from './components/PlayerForm';
import Lobby from './components/Lobby';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<PlayerForm />} />
      <Route path="/lobby" element={<Lobby />} />
    </Routes>
  );
};

export default App;
