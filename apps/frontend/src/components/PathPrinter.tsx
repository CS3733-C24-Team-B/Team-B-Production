import {useEffect, useState} from "react";
import axios from "axios";

export const PathPrinter = (data: { startNode: string; endNode: string }) => {

    // Join the array of words into a single string

    // [speaking, setSpeaking] = useState(false);
    const [words, setPath] = useState([""]);
    const joinedWords = words.join(' -> ');

    useEffect(() => {
        console.log("SUS");
        async function fetch() {
          //  console.log(`${data.startNode}`);
                const res2 = await axios.get(`/api/db-get-path/${data.startNode}/${data.endNode}`);
            setPath(res2.data);
        }
        fetch().then();
    }, [data.endNode, data.startNode]);

    // const speakArray = () => {
    //     if (!speaking && window.speechSynthesis) {
    //         setSpeaking(true);
    //
    //         const utterance = new SpeechSynthesisUtterance(words.join(" to "));
    //         utterance.onend = () => {
    //             setSpeaking(false);
    //         };
    // utterance.rate=0.5;
    //         window.speechSynthesis.speak(utterance);
    //     }
    // };

    return (
        <pre>{"" + data.startNode + " " + data.endNode + " " + words[0] + " " + joinedWords}</pre>
    );
};
