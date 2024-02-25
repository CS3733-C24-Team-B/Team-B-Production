import React, {useEffect, useState, useRef} from 'react';
// import axios from "axios";
import LowerLevel1 from "../../images/00_thelowerlevel1.png";

export default function Canvas() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    const [ctx, setCtx] = useState(canvasCtxRef.current);

    useEffect(() => {
        // Initialize
        if (canvasRef.current) {
            canvasCtxRef.current = canvasRef.current.getContext("2d");
        }
    }, []);

    const image = new Image();
    image.src = LowerLevel1;
    setTimeout(draw, 100);

    function draw() {
        setCtx(canvasCtxRef.current);
        if (ctx == null) {
            console.log("ctx is null");
            return;
        }
        ctx!.drawImage(image, 0, 0, 5000, 3400);
        ctx!.beginPath();
        ctx!.arc(25, 17, 5, 0, 2 * Math.PI, false);
        ctx!.fillStyle = "#0000FF";
        ctx!.fill();
        console.log("ctx is not null");
    }


    return <canvas ref={canvasRef} height={3400} width={5000}/>;
}
