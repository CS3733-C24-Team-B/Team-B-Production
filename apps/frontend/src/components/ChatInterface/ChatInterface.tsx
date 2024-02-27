import React, { useState, KeyboardEvent } from 'react';
import './styles.css'; // Assuming you have some basic CSS for styling

interface Message {
    sender: 'user' | 'bot';
    text: string;
}

interface Props {
    onClose: () => void;
}

const ChatInterface: React.FC<Props> = ({ onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = (msg: string): void => {
        // Simulate sending a message and receiving a response
        setMessages([...messages, { sender: 'user', text: msg }, { sender: 'bot', text: 'Echo: ' + msg }]);
    };

    const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>): void => {
        if (event.key === 'Enter' && event.currentTarget.value.trim() !== '') {
            sendMessage(event.currentTarget.value);
            event.currentTarget.value = ''; // Clear the input after sending
        }
    };

    return (
        <div className="chat-interface">
            <button onClick={onClose}>Close</button>
            <div className="messages">
                {messages.map((msg, index) => (
                    <div key={index} className={msg.sender}>
                        {msg.text}
                    </div>
                ))}
            </div>
            <input type="text" onKeyDown={handleKeyDown} />
        </div>
    );
};

export default ChatInterface;
