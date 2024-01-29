import React, {useEffect, useState} from "react";
import axios from "axios";

export const PathPrinter = (data: { startNode: string; endNode: string }) => {

    // Join the array of words into a single string

    const [speaking, setSpeaking] = useState(false);
    const [words, setPath] = useState([""]);
    const joinedWords = words.join(' -> ');

    useEffect(() => {
        async function fetch() {
          //  console.log(`${data.startNode}`);
                const res2 = await axios.get(`/api/db-get-path/${data.startNode}/${data.endNode}`);
            setPath(res2.data);
        }
        fetch().then();
    }, [data.endNode,data.startNode]);

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
            <pre>{joinedWords}</pre>
            <button onClick={speakArray} disabled={speaking}>
                {speaking ? 'Speaking...' : 'Speak Array'}
            </button>
        </div>
    );
};
