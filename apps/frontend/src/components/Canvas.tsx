import React, { useRef, useEffect, useState } from 'react';
import axios from "axios";

interface CanvasProps {
    width: number;
    height: number;
    imageSource: string;
}

const Canvas = ({ width, height, imageSource }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodeData, setNodeData] = useState([]);
    let startX = 0;
    let startY = 0;
    let drawLine = false;
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    let ctx = canvasCtxRef.current;

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
            const xPos = xcoord * (window.innerWidth / 5000);
            const yPos = ycoord * (window.innerHeight / 3400);
            if(Math.abs(xPos - xPosition) < 5 && Math.abs(yPos - yPosition) < 5) {
                console.log(longName);
                if(drawLine) {
                    ctx = canvasCtxRef.current;
                    ctx!.beginPath();
                    ctx?.moveTo(startX, startY);
                    ctx?.lineTo(xPos, yPos);
                    ctx!.strokeStyle = "green";
                    ctx!.lineWidth = 3;
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
        nodeData.map(({xcoord, ycoord}) => {
            const xPos = xcoord * (window.innerWidth / 5000);
            const yPos = ycoord * (window.innerHeight / 3400);
            if(Math.abs(xPos - xPosition) < 5 && Math.abs(yPos - yPosition) < 5) {
                ctx!.beginPath();
                ctx!.arc(xPos, yPos, 3, 0, 2 * Math.PI, false);
                ctx!.fillStyle = "green";
                ctx!.fill();
            }
            else {
                ctx!.beginPath();
                ctx!.arc(xPos, yPos, 3, 0, 2 * Math.PI, false);
                ctx!.fillStyle = "blue";
                ctx!.fill();
            }
        });
    };

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



        nodeData.map(({xcoord, ycoord}) => {
            ctx!.beginPath();
            ctx!.arc(xcoord*(width/5000), ycoord*(height/3400), 3, 0, 2 * Math.PI, false);
            ctx!.fillStyle = "#0000FF";
            ctx!.fill();
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
