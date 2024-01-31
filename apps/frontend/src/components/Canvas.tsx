import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";
import "../css/home_page.css";

interface CanvasProps {
    width: number;
    height: number;
    imageSource: string;
    currLevel: string;
}

const widthRatio = 5000;
const heightRatio = 3400;
const clickDist = 5;
const minDrawSize = 3;
const maxDrawSize = 8;

const Canvas = ({ width, height, imageSource, currLevel }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodeData, setNodeData] = useState([]);
    // let startX = 0;
    // let startY = 0;
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [drawLine, setDrawLine] = useState(false);
    const [pathData, setPathData] = useState([]);
    //const [words, setPath] = useState([""]);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    const [ctx, setCtx] = useState(canvasCtxRef.current);

    function getDrawSize() {
        let drawSize = (widthRatio + heightRatio) / 2500;
        if(drawSize < minDrawSize) {
            drawSize = minDrawSize;
        } else if(drawSize > maxDrawSize) {
            drawSize = maxDrawSize;
        }
        return drawSize;
    }

    async function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPosition = e.clientX - rect.left;
        const yPosition = e.clientY - rect.top;
        // coords.forEach((nc) => {
        //     if(Math.abs(nc.xPos - xPosition) < 10 && Math.abs(nc.yPos - yPosition) < 10) {
        //         return nc.roomName;
        //     }
        // });
        // console.log(width + " " + height);
        nodeData.map(({nodeID, xcoord, ycoord}) => {
            const xPos = xcoord * (width / widthRatio);
            const yPos = ycoord * (height / heightRatio);
            if(Math.abs(xPos - xPosition) < clickDist && Math.abs(yPos - yPosition) < clickDist) {
                if(drawLine) {
                    setNodeEnd(nodeID);
                } else {
                    setNodeStart(nodeID);
                }
                setDrawLine(!drawLine);
            }
        });
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPosition = e.clientX - rect.left;
        const yPosition = e.clientY - rect.top;
        nodeData.map(({xcoord, ycoord, floor}) => {
            if(floor === currLevel) {
                const xPos = xcoord * (window.innerWidth / widthRatio);
                const yPos = ycoord * (window.innerHeight / heightRatio);
                if (Math.abs(xPos - xPosition) < clickDist && Math.abs(yPos - yPosition) < clickDist) {
                    ctx!.beginPath();
                    ctx!.arc(xPos, yPos, getDrawSize(), 0, 2 * Math.PI, false);
                    ctx!.fillStyle = "green";
                    ctx!.fill();
                } else {
                    ctx!.beginPath();
                    ctx!.arc(xPos, yPos, getDrawSize(), 0, 2 * Math.PI, false);
                    ctx!.fillStyle = "blue";
                    ctx!.fill();
                }
            }
        });
    };

    const handleResize = () => {
        height = window.innerHeight;
        width = window.innerWidth;
        requestAnimationFrame(() => draw());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            }
            catch{
                console.log("post error");
            }
            const res = await axios.get("/api/db-get-nodes");

            console.log(res.data);
            setNodeData(res.data);
        }
        fetch().then();
    }, []);

    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/db-get-path/${nodeStart}/${nodeEnd}`);
            //console.log(res2.data);
            //setPath(res2.data);
            setPathData(res2.data);

        }
        fetch().then();
    }, [nodeEnd, nodeStart]);

    const image = new Image();
    image.src = imageSource;
    setTimeout(draw, 100);

    function draw() {
        setCtx(canvasCtxRef.current);
        if (ctx == null) {
            return;
        }

        console.log(width + " " + height);

        ctx!.clearRect(0, 0, width, height);

        ctx?.drawImage(image, 0, 0, width, height);

        nodeData.map(({xcoord, ycoord, floor}) => {
            if(floor === currLevel) {
                ctx!.beginPath();
                ctx!.arc(xcoord * (width / widthRatio), ycoord * (height / heightRatio), getDrawSize(), 0, 2 * Math.PI, false);
                ctx!.fillStyle = "#0000FF";
                ctx!.fill();
            }
        });

        const nameToXPos = (name : string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["xcoord"];
        };

        const nameToYPos = (name : string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["ycoord"];
        };

        if(pathData.length > 1) {
            let startX = -1;
            let startY = -1;
            for (const nr of pathData) {
                const xPos = nameToXPos(nr) * (window.innerWidth / widthRatio);
                const yPos = nameToYPos(nr) * (window.innerHeight / heightRatio);
                console.log(nr + " " + xPos + " " + yPos);
                if (startX != -1 && startY != -1) {
                    ctx!.beginPath();
                    ctx?.moveTo(startX, startY);
                    ctx?.lineTo(xPos, yPos);
                    ctx!.strokeStyle = "green";
                    ctx!.lineWidth = getDrawSize();
                    ctx!.stroke();
                }
                startX = xPos;
                startY = yPos;
            }
        }
    }

    image.onload = () => {
        ctx?.drawImage(image, 0, 0, width, height);
    };


    useEffect(() => {
        // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
        }
    }, []);

    return <canvas ref={canvasRef} height={height} width={width} onClick={handleClick} onMouseMove={handleMouseMove}/>;
};

Canvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Canvas;
