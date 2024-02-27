import React, { useState, useEffect } from 'react';

const Chatbox: React.FC = () => {
    const [state, setState] = useState<boolean>(false);
    const [messages, setMessages] = useState<Array<{ name: string; message: string }>>([]);
    const [inputValue, setInputValue] = useState<string>('');

    const toggleState = () => {
        setState(!state);
    };

    const sendMessage = (text: string) => {
        if (text === "") return;

        const userMessage = { name: "User", message: text };
        setMessages([...messages, userMessage]);

        fetch('http://127.0.0.1:5000/predict', {
            method: 'POST',
            body: JSON.stringify({ message: text }),
            mode: 'cors',
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(response => response.json())
            .then(data => {
                const botMessage = { name: "Sam", message: data.answer };
                setMessages(currentMessages => [...currentMessages, botMessage]);
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    const handleSendClick = () => {
        sendMessage(inputValue);
        setInputValue('');
    };

    const handleKeyUp = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleSendClick();
        }
    };

    return (
        <div className={`chatbox__support ${state ? 'chatbox--active' : ''}`}>
            <button onClick={toggleState} className="chatbox__button">Chat</button>
            <div className="chatbox__messages">
                {/* Messages display logic here */}
            </div>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyUp={handleKeyUp} />
            <button onClick={handleSendClick} className="send__button">Send</button>
        </div>
    );
};

export default Chatbox;
