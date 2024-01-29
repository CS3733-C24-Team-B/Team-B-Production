import React, {useEffect, useState} from "react";
import axios from "axios";
export default function PathPrinter(){

    // Join the array of words into a single string

    const [speaking, setSpeaking] = useState(false);
    const [words, setPath] = useState([""]);
    const joinedWords = words.join(' -> ');

    useEffect(() => {
        async function fetch() {
                const res2 = await axios.get("/api/db-get-path/WELEV00HL1/CSERV001L1");
                setPath(res2.data);
        }
        fetch().then();
    }, []);

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
            <h2>Hospital Path</h2>
            <form action="/api/saveData" method="POST">
                <label htmlFor="dataInput">Enter data:</label>
                <input type="text" id="dataInput" name="dataInput" required/>
                <button type="submit">Save Data</button>
            </form>
            <p>{joinedWords}</p>
            <button onClick={speakArray} disabled={speaking}>
                {speaking ? 'Speaking...' : 'Speak Array'}
            </button>
        </div>
    );
};
