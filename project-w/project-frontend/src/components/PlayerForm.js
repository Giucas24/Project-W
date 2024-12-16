import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import socket from './socket';
import './styles/PlayerForm.css'; // Importa gli stili

const emojiList = ['😀', '😎', '😇', '🥳', '🤓', '🤖', '👾', '🐵', '🐱', '🐶']; // Lista di emoji disponibili

const PlayerForm = () => {
    const [username, setUsername] = useState('');
    const [avatar, setAvatar] = useState('😀'); // Emoji di default
    const [isEmojiPickerOpen, setIsEmojiPickerOpen] = useState(false); // Stato per il pannello emoji
    const navigate = useNavigate(); // Hook per la navigazione

    // Funzione per inviare i dati al backend quando il form viene inviato
    const handleFormSubmit = (event) => {
        event.preventDefault();
        if (!username) {
            alert('Per favore, inserisci un nome utente!');
            return;
        }

        // Invia il giocatore al server
        socket.emit('joinLobby', { name: username, avatar });

        // Naviga alla lobby
        navigate('/lobby', { state: { username, avatar } });
    };

    // Funzione per aprire il pannello delle emoji
    const toggleEmojiPicker = () => {
        setIsEmojiPickerOpen((prevState) => !prevState); // Mostra o nasconde il pannello
    };

    // Funzione per selezionare l'emoji
    const selectEmoji = (emoji) => {
        setAvatar(emoji); // Imposta l'emoji selezionata come avatar
        setIsEmojiPickerOpen(false); // Chiudi il pannello
    };

    return (
        <div className="player-form-container">
            <h2>Project W</h2>
            <form onSubmit={handleFormSubmit} autoComplete='off'>
                {/* Input per il nome utente */}
                <div className="form-group">
                    <input
                        type="text"
                        id="username"
                        placeholder="Inserisci il tuo nome utente"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                </div>

                {/* Selezione avatar con emoji */}
                <div className="form-group avatar-selector">
                    <div className="selected-avatar" onClick={toggleEmojiPicker}>
                        {avatar} {/* Mostra l'emoji selezionata */}
                    </div>

                    {isEmojiPickerOpen && (
                        <div className="emoji-picker">
                            {emojiList.map((emoji) => (
                                <span
                                    key={emoji}
                                    className="emoji-option"
                                    onClick={() => selectEmoji(emoji)}
                                >
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                {/* Bottone per la creazione della lobby */}
                <button type="submit" className="create-lobby-button">
                    Crea Lobby Privata
                </button>
            </form>
        </div>
    );
};

export default PlayerForm;
