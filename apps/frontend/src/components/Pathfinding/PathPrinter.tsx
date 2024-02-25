import {useEffect, useState} from "react";
import axios from "axios";
import { Button, Paper } from "@mui/material";

function determineTurnDirection(previousNode:string,nodeStart:string,nodeEnd:string): string {
    // Calculate vectors AB and BC
    const x = parseInt(previousNode.substring(previousNode.indexOf(":")+1,previousNode.lastIndexOf(":")));
    const y = parseInt(previousNode.substring(previousNode.lastIndexOf(":")+1));
    const x1 = parseInt(nodeStart.substring(nodeStart.indexOf(":")+1,nodeStart.lastIndexOf(":")));
    const y1 = parseInt(nodeStart.substring(nodeStart.lastIndexOf(":")+1));
    const x2 = parseInt(nodeEnd.substring(nodeEnd.indexOf(":")+1,nodeEnd.lastIndexOf(":")));
    const y2 = parseInt(nodeEnd.substring(nodeEnd.lastIndexOf(":")+1));
    const vectorAB = [ x1-x, y1-y ];
    const vectorBC = [x2-x1,y2-y1];

    // Calculate cross product (z-component only for 2D vectors)
    const crossProduct = vectorAB[0] * vectorBC[1] - vectorAB[1] * vectorBC[0];

    if (crossProduct < -500) {
        // console.log(nodeStart+": "+crossProduct);
        if(crossProduct>-2000){
            return "Make a slight left ";
        }
        return "Make a left ";
    } else if (crossProduct > 500) {
        // console.log(nodeStart+": "+crossProduct);
        if(crossProduct<2000){
            return "Make a slight right ";
        }
        return "Make a right ";
    } else {
        return "";
    }
}
function directNode(previousNode:string,nodeStart:string,nodeEnd:string){

    if(previousNode.substring(0,2)!=nodeStart.substring(0,2)){
        return "Take the elevator from "+previousNode.substring(0,2)+" to ";
    }
    if(nodeStart.substring(0,2)!=nodeEnd.substring(0,2)){
        return "";
    }
    // let output:string ="";
    return determineTurnDirection(previousNode,nodeStart,nodeEnd);

/*Starting at Elevator L Floor L2
Make a left at Hallway 8 Floor L2
Make a left at Hallway 7 Floor L2
Make a right at Hallway 6 Floor L2
Continue straight until you reach Hallway 8 Floor L2
Make a left at Hallway 5 Floor L2
You have arrived at Radiation Oncology Floor L2*/
}
export const PathPrinter = (data: { startNode: string; endNode: string; changeText: (text: string[]) => void }) => {

    // Join the array of words into a single string

    const [speaking, setSpeaking] = useState(false);
    // const [words, setPath] = useState([""]);
    const [coordinates, setCoords] = useState([""]);

    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/path/${data.startNode}/${data.endNode}`);
            const nodeIDs = res2.data.reduce((accumulator: string[], roomData: {
                nodeID: string;
                xcoord: number;
                ycoord: number;
                floor: string;
                building: string;
                nodeType: string;
                longName: string;
                shortName: string;
            }) => {
                const { longName } = roomData;
                accumulator.push(longName);
                return accumulator;
            }, []);
            let coords = res2.data.reduce((accumulator: string[], roomData: {
                nodeID: string;
                xcoord: number;
                ycoord: number;
                floor: string;
                building: string;
                nodeType: string;
                longName: string;
                shortName: string;
            }) => {
                const { longName,xcoord,ycoord,floor } = roomData;

                accumulator.push(floor+" "+longName+":"+xcoord+":"+ycoord);
                return accumulator;
            }, []);
            coords=coords.reverse();
            // console.log(nodeIDs);
            coords=coords.reverse();
            // console.log(coords);
            setCoords(coords);
            let joinedwords:string[] = ["You have arrived at "+nodeIDs[nodeIDs.length-1]];
            if(data.startNode===data.endNode){
                setCoords(joinedwords);
                return;
            }
            // setPath(nodeIDs);
            let x:number = parseInt(coords[coords.length-1].substring(coords[coords.length-1].indexOf(":")+1,coords[coords.length-1].lastIndexOf(":")));
            let y:number = parseInt(coords[coords.length-1].substring(coords[coords.length-1].lastIndexOf(":")+1));
            for( let i = coords.length-2; i >0;i--){
                const direction =directNode(coords[i-1],coords[i],coords[i+1]);
                if(direction!="") {
                    const currx = parseInt(coords[i].substring(coords[i].indexOf(":")+1,coords[i].lastIndexOf(":")));
                    const curry = parseInt(coords[i].substring(coords[i].lastIndexOf(":")+1));
                    const dist =Math.sqrt((currx-x)**2+(curry-y)**2);

                        joinedwords.push(direction+" at "+ nodeIDs[i] +" ("+Math.round(dist/4)+"ft)");

                    x = parseInt(coords[i].substring(coords[i].indexOf(":")+1,coords[i].lastIndexOf(":")));
                    y = parseInt(coords[i].substring(coords[i].lastIndexOf(":")+1));
                }
            }
            joinedwords.push("Starting at "+nodeIDs[0]+" head in the direction of "+ nodeIDs[1]);
            joinedwords=joinedwords.reverse();

            setCoords(joinedwords);
            data.changeText(joinedwords);
        }

        fetch().then();
    }, [data, data.startNode, data.endNode]);

    const speakArray = () => {
        if (!speaking && window.speechSynthesis) {
            setSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(coordinates.join(" "));
            utterance.onend = () => {
                setSpeaking(false);
            };
            utterance.rate=1;
            window.speechSynthesis.speak(utterance);
        }
        else{
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    };

    return (
        <div style={{maxHeight: '10%', width: 250}}>
            <Paper style={{minHeight: '30vh', maxHeight: '30vh'}} className={"text-paper"}>
                <ul id="text">{coordinates.map(obj=><li style={{fontFamily: 'Lato'}}>{obj}</li>)}</ul>
            </Paper>
            <br/>
            <Button size="small" onClick={speakArray}
                    style={{backgroundColor: "#012D5A", color:'white', fontSize: '1.5vh', width: '100%' }}>
                {speaking ? 'Stop Speaking' : 'Speak Path'}
            </Button>
        </div>);
};
