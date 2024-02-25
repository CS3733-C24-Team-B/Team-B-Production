import {useEffect, useState} from "react";
import axios from "axios";
import {Button, Paper} from "@mui/material";
import TurnSlightLeftIcon from '@mui/icons-material/TurnSlightLeft';
import TurnLeftIcon from '@mui/icons-material/TurnLeft';
import TurnSlightRightIcon from '@mui/icons-material/TurnSlightRight';
import TurnRightIcon from '@mui/icons-material/TurnRight';
import PlaceIcon from '@mui/icons-material/Place';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ElevatorIcon from '@mui/icons-material/Elevator';
import StairsIcon from '@mui/icons-material/Stairs';
import DirectionsIcon from '@mui/icons-material/Directions';

function determineTurnDirection(previousNode: string, nodeStart: string, nodeEnd: string): string {
    // Calculate vectors AB and BC
    const x = parseInt(previousNode.substring(previousNode.indexOf(":") + 1, previousNode.lastIndexOf(":")));
    const y = parseInt(previousNode.substring(previousNode.lastIndexOf(":") + 1));
    const x1 = parseInt(nodeStart.substring(nodeStart.indexOf(":") + 1, nodeStart.lastIndexOf(":")));
    const y1 = parseInt(nodeStart.substring(nodeStart.lastIndexOf(":") + 1));
    const x2 = parseInt(nodeEnd.substring(nodeEnd.indexOf(":") + 1, nodeEnd.lastIndexOf(":")));
    const y2 = parseInt(nodeEnd.substring(nodeEnd.lastIndexOf(":") + 1));
    const vectorAB = [x1 - x, y1 - y];
    const vectorBC = [x2 - x1, y2 - y1];

    // Calculate cross product (z-component only for 2D vectors)
    const crossProduct = vectorAB[0] * vectorBC[1] - vectorAB[1] * vectorBC[0];

    if (crossProduct < -500) {
        // console.log(nodeStart+": "+crossProduct);
        if (crossProduct > -2000) {
            return "Make a slight left";
        }
        return "Make a left";
    } else if (crossProduct > 500) {
        // console.log(nodeStart+": "+crossProduct);
        if (crossProduct < 2000) {
            return "Make a slight right";
        }
        return "Make a right";
    } else {
        return "";
    }
}

function directNode(previousNode: string, nodeStart: string, nodeEnd: string) {

    if (previousNode.substring(0, 2) != nodeStart.substring(0, 2)) {
        return "Take the elevator from " + previousNode.substring(0, 2) + " to";
    }
    if (nodeStart.substring(0, 2) != nodeEnd.substring(0, 2)) {
        return "";
    }
    // let output:string ="";
    return determineTurnDirection(previousNode, nodeStart, nodeEnd);

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
                const {longName} = roomData;
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
                const {longName, xcoord, ycoord, floor} = roomData;

                accumulator.push(floor + " " + longName + ":" + xcoord + ":" + ycoord);
                return accumulator;
            }, []);
            let directionsFloor: string[][] = [];
            let levels:number = 0;
            let joinedwords: string[] = ["You have arrived at " + nodeIDs[nodeIDs.length - 1]];
            if (data.startNode === data.endNode) {
                setCoords(joinedwords);
                return;
            }
            // setPath(nodeIDs);
            let x: number = parseInt(coords[coords.length - 1].substring(coords[coords.length - 1].indexOf(":") + 1, coords[coords.length - 1].lastIndexOf(":")));
            let y: number = parseInt(coords[coords.length - 1].substring(coords[coords.length - 1].lastIndexOf(":") + 1));
            setCoords(["test test2"]);
            for (let i = coords.length - 2; i > 0; i--) {
                const direction = directNode(coords[i - 1], coords[i], coords[i + 1]);

                if (direction != "") {
                    const currx = parseInt(coords[i].substring(coords[i].indexOf(":") + 1, coords[i].lastIndexOf(":")));
                    const curry = parseInt(coords[i].substring(coords[i].lastIndexOf(":") + 1));
                    const dist = Math.sqrt((currx - x) ** 2 + (curry - y) ** 2);

                    if(nodeIDs[i].includes("Elevator")){
                        //if(coords[i].substring(0,2)!==coords[i-1].substring(0,2)){
                        directionsFloor[levels]=joinedwords;
                        joinedwords=["Floor "+coords[i+1].substring(0,2)+""];
                        levels++;
                    }
                   joinedwords.push(direction + " at " + nodeIDs[i] + " (" + Math.round(dist / 4) + "ft)");

                    x = parseInt(coords[i].substring(coords[i].indexOf(":") + 1, coords[i].lastIndexOf(":")));
                    y = parseInt(coords[i].substring(coords[i].lastIndexOf(":") + 1));
                }

            }
            directionsFloor[levels]=joinedwords;
            joinedwords.push("Starting at " + nodeIDs[0] + " head in the direction of " + nodeIDs[1]);

            joinedwords = [];
            for(let i = 0; i < directionsFloor.length;i++){

                joinedwords=joinedwords.concat(directionsFloor[i]);
            }
            joinedwords.push("Floor "+coords[0].substring(0,2)+"");
                setCoords(joinedwords.reverse());

           // for(let direc in joinedwords){
             //   directionByFloor.set()
            //}
        }

        fetch().then();
    }, [data.startNode, data.endNode]);
    function getIcon(startingText: string) {
        if (startingText.startsWith("Starting at")) {
            return <MyLocationIcon/>;
        } else if (startingText.startsWith("Make a slight left")) {
            return <TurnSlightLeftIcon/>;
        } else if (startingText.startsWith("Make a left")) {
            return <TurnLeftIcon/>;
        } else if (startingText.startsWith("Make a slight right")) {
            return <TurnSlightRightIcon/>;
        } else if (startingText.startsWith("Make a right")) {
            return <TurnRightIcon/>;
        } else if (startingText.startsWith("Take the elevator")) {
            return <ElevatorIcon/>;
        } else if (startingText.startsWith("Take the stairs")) {
            return <StairsIcon/>;
        } else if (startingText.startsWith("Floor")) {
            return  <DirectionsIcon/>;
        } else {
            return <PlaceIcon/>;
        }
    }

    data.changeText(coordinates);

    const speakArray = () => {
        if (!speaking && window.speechSynthesis) {
            setSpeaking(true);

            const utterance = new SpeechSynthesisUtterance(coordinates.join(" "));
            utterance.onend = () => {
                setSpeaking(false);
            };
            utterance.rate = 1;
            window.speechSynthesis.speak(utterance);
        } else {
            window.speechSynthesis.cancel();
            setSpeaking(false);
        }
    };


    const directionsArray = coordinates.map(function (obj: string) {
        if(obj.startsWith("Floor")) {
            return (
                <li style={{fontFamily: 'Lato', fontSize: '0.75em'}}>
                    <hr/>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center',alignSelf:"center", fontWeight:"bolder"}}>
                        <div style={{paddingLeft:10}}>{getIcon(obj)}</div>
                            <div style={{padding:10}}>{obj}</div>

                    </div>
                </li>
            );
        } else{
            return (
                <li style={{fontFamily: 'Lato', fontSize: '0.75em'}}>
                    <div style={{display: 'flex', flexDirection: 'row', alignItems: 'center'}}>
                        <div style={{paddingLeft:10}}>{getIcon(obj)}</div>
                        <div style={{padding:10}}>{obj}</div>
                    </div>
                </li>
            );
        }
        });

    return (
        <div style={{maxHeight: '10%', width: 250}}>
            <Paper style={{minHeight: '30vh', maxHeight: '30vh'}} className={"text-paper"}>
                <ul>{directionsArray}</ul>
            </Paper>
            <br/>
            <Button size="small" onClick={speakArray}
                    style={{backgroundColor: "#012D5A", color: 'white', fontSize: '1.5vh', width: '100%'}}>
                {speaking ? 'Stop Speaking' : 'Speak Path'}
            </Button>
        </div>);
};
