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
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    let ctx = canvasCtxRef.current;

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

    return <canvas ref={canvasRef} height={height} width={width} />;
};

Canvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Canvas;
