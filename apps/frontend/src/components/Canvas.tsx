import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";

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
    let startX = 0;
    let startY = 0;
    let drawLine = false;
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    let ctx = canvasCtxRef.current;

    function getDrawSize() {
        let drawSize = (widthRatio + heightRatio) / 2500;
        if(drawSize < minDrawSize) {
            drawSize = minDrawSize;
        } else if(drawSize > maxDrawSize) {
            drawSize = maxDrawSize;
        }
        return drawSize;
    }

    const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const xPosition = e.clientX - rect.left;
        const yPosition = e.clientY - rect.top;
        // coords.forEach((nc) => {
        //     if(Math.abs(nc.xPos - xPosition) < 10 && Math.abs(nc.yPos - yPosition) < 10) {
        //         return nc.roomName;
        //     }
        // });
        console.log(width + " " + height);
        nodeData.map(({longName, xcoord, ycoord}) => {
            const xPos = xcoord * (window.innerWidth / widthRatio);
            const yPos = ycoord * (window.innerHeight / heightRatio);
            if(Math.abs(xPos - xPosition) < clickDist && Math.abs(yPos - yPosition) < clickDist) {
                console.log(longName);
                if(drawLine) {
                    ctx = canvasCtxRef.current;
                    ctx!.beginPath();
                    ctx?.moveTo(startX, startY);
                    ctx?.lineTo(xPos, yPos);
                    ctx!.strokeStyle = "green";
                    ctx!.lineWidth = getDrawSize();
                    ctx!.stroke();
                } else {
                    startX = xPos;
                    startY = yPos;
                }
                drawLine = !drawLine;
            }
        });
    };

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

    const image = new Image();
    image.src = imageSource;
    setTimeout(draw, 100);

    function draw() {
        ctx = canvasCtxRef.current;
        if (ctx == null) {
            return;
        }

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
    }

    image.onload = () => {
        ctx?.drawImage(image, 0, 0, width, height);
    };


    useEffect(() => {
        // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
        }
    }, [ctx]);

    return <canvas ref={canvasRef} height={height} width={width} onClick={handleClick} onMouseMove={handleMouseMove}/>;
};

Canvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Canvas;
