import React, { useState } from 'react';
import { postMessage } from '../services/ChatService';

const ChatComponent = () => {
    const [message, setMessage] = useState('');
    const [response, setResponse] = useState('');

    const sendMessage = async () => {
        if (message.trim() !== '') {
            const answer = await postMessage(message);
            setResponse(answer);
            setMessage('');
        }
    };

    return (
        <div>
            <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
            />
            <button onClick={sendMessage}>Send</button>
            {response && <p>Bot: {response}</p>}
        </div>
    );
};

export default ChatComponent;
