
import React, {useState} from 'react';

export default function PathPrinter(){

    const words: string[] = ['Apple', 'Banana', 'Orange'];
    // Join the array of words into a single string
    const joinedWords = words.join(' -> ');

    const [speaking, setSpeaking] = useState(false);

    const speakArray = () => {
        if (!speaking && window.speechSynthesis) {
            setSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(words.join(" to "));
            utterance.onend = () => {
                setSpeaking(false);
            };

            window.speechSynthesis.speak(utterance);
        }
    };

    return (
        <div>
            <h2>Array Items</h2>
            <p>{joinedWords}</p>
            <button onClick={speakArray} disabled={speaking}>
                {speaking ? 'Speaking...' : 'Speak Array'}
            </button>
        </div>
    );
};
