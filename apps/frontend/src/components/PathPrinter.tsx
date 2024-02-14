import {useEffect, useState} from "react";
import axios from "axios";
import { Button } from "@mui/material";

function calculateSlope(x1:number,x2:number,y1:number,y2:number): number {
    // Calculate the slope of the line passing through two points
    return (y2 - y1) / (x2 - x1);
}
function calculateVector(x1:number,x2:number,y1:number,y2:number){
    return [(x2-x1),(y2-y1)] as number[];
}
function findAngleBetweenLines(slope2: number, slope1: number): number {
    // Calculate the absolute difference between slopes
    const delta_slope = Math.abs(slope1 - slope2);

    // Calculate the angle in radians
    const angle_rad = Math.atan(delta_slope);

    // Convert angle from radians to degrees
    const angle_deg = angle_rad * (180 / Math.PI);

    return angle_deg;
}
function directNode(previousNode:string,nodeStart:string,nodeEnd:string){
    const x = parseInt(previousNode.substring(previousNode.indexOf(":")+1,previousNode.lastIndexOf(":")));
    const y = parseInt(previousNode.substring(previousNode.lastIndexOf(":")+1));
    const x1 = parseInt(nodeStart.substring(nodeStart.indexOf(":")+1,nodeStart.lastIndexOf(":")));
    const y1 = parseInt(nodeStart.substring(nodeStart.lastIndexOf(":")+1));
    const x2 = parseInt(nodeEnd.substring(nodeEnd.indexOf(":")+1,nodeEnd.lastIndexOf(":")));
    const y2 = parseInt(nodeEnd.substring(nodeEnd.lastIndexOf(":")+1));
    let right = false;
    const vector2 = calculateVector(x1,x2,y1,y2);
    const vector1 = calculateVector(x,x1,y,y1);

    //vector1[0] >0 = right
    //vector1[0] <0 = left
    //vector1[1] <0 = up
    //vector1[1] >0 = down

    //vector2[0] >0 = right
    //vector2[0] <0 = left
    //vector2[1] <0 = up
    //vector2[1] >0 = down
    const vector2up = vector2[1]<0;
    const vector2right = vector2[0]>0;
    const vector1right = vector1[0]>0;
    const vector1up = vector1[1]<0;
    if(vector1up&&vector2right||!vector1up&&!vector2right||vector1right&&!vector2up||!vector1right&&vector2up){

        right=true;
    }
    if(previousNode.substring(0,2)!=nodeStart.substring(0,2)){
        return "Take the elevator to";
    }
    let slope1 = calculateSlope(x,x1,y,y1);
    console.log(slope1);
    let slope2 = calculateSlope(x1,x2,y1,y2);

    console.log(slope2);
    const angle = findAngleBetweenLines(slope2, slope1);
    console.log("x:"+x+" y:"+y);
    console.log("x1:"+x1+" y1:"+y1);
    console.log("x2:"+x2+" y2:"+y2);
    console.log("ANGLE: "+angle);
    // let output:string ="";
    let direction = "";
    if(Number.isNaN(angle)){
        return "";
    }
    const distFromStraight = Math.abs(angle%180);
    if(distFromStraight<50){
        return "";
    }
    if( (!right)){
        direction+= "left turn "+" "/*+ vector1[0]+","+vector1[1]+" "+vector2[0]+","+vector2[1]+" "*/;
    }else{
        direction+="right turn "+" "/*+ vector1[0]+","+vector1[1]+" "+vector2[0]+","+vector2[1]+" "*/;
    }
    if(distFromStraight>=60){
        return "Make a "+direction + "at";
    }
    if(distFromStraight<60){
        return "Make a slight "+direction + "at";
    }
    else{
        return "ERROR!!! ";
    }

}
export const PathPrinter = (data: { startNode: string; endNode: string }) => {

    // Join the array of words into a single string

    const [speaking, setSpeaking] = useState(false);
    // const [words, setPath] = useState([""]);
    const [coordinates, setCoords] = useState([""]);
    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/db-get-path/${data.startNode}/${data.endNode}`);
            let nodeIDs = res2.data.reduce((accumulator: string[], roomData: {
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
            console.log(nodeIDs);
            coords=coords.reverse();
            console.log(coords);
            setCoords(coords);
            let joinedwords:string[] = ["You have arrived at "+nodeIDs[nodeIDs.length-1]];
            // setPath(nodeIDs);
            for( let i = coords.length-2; i >0;i--){
                const direction =directNode(coords[i-1],coords[i],coords[i+1]);
                if(direction!="") {
                    joinedwords.push(direction+" "+ nodeIDs[i]);
                }
            }
            joinedwords.push("Starting at "+nodeIDs[0]+" ");
            joinedwords=joinedwords.reverse();

            setCoords(joinedwords);
        }
        fetch().then();
    }, [data.endNode, data.startNode]);

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
        <div>
            <h2>Hospital Path</h2>
            <ul>{coordinates.map(obj=><li>{obj}</li>)}</ul>
            <Button size="small" onClick={speakArray}
                    style={{backgroundColor: "#012D5A", color:'white', fontSize: '1.5vh', width: '15.5vw' }}>
                {speaking ? 'Stop Speaking' : 'Speak Array'}
            </Button>
        </div>);
};
