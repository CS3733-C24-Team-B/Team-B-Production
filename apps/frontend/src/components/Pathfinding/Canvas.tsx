import React, { useEffect, useState, useRef } from "react";
import axios from "axios";

export default function Canvas(props: {
  pathData: string[];
  floorImg: string;
}) {
  const { pathData, floorImg } = props;
  const [nodeData, setNodeData] = useState([]);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
  const [ctx, setCtx] = useState(canvasCtxRef.current);

  useEffect(() => {
    async function fetch() {
      const res3 = await axios.get("/api/nodes/read");
      setNodeData(res3.data);
    }

    fetch().then();
  }, []);

  useEffect(() => {
    // Initialize
    if (canvasRef.current) {
      canvasCtxRef.current = canvasRef.current.getContext("2d");
    }
  }, []);

  const nodeIDToXPos = (nId: string) => {
    return nodeData.find(({ nodeID }) => nId === nodeID)!["xcoord"];
  };

  const nodeIDToYPos = (nId: string) => {
    return nodeData.find(({ nodeID }) => nId === nodeID)!["ycoord"];
  };

  const image = new Image();
  image.src = floorImg;
  setTimeout(draw, 100);

  function draw() {
    setCtx(canvasCtxRef.current);
    if (ctx == null) {
      return;
    }
    ctx!.drawImage(image, 0, 0, 5000, 3400);
    if (pathData.length > 0 && nodeData.length > 0) {
      let startX = -1;
      let startY = -1;
      for (const nr of pathData) {
        const toX = nodeIDToXPos(nr);
        const toY = nodeIDToYPos(nr);
        if (startX !== -1 && startY !== -1) {
          ctx!.beginPath();
          ctx?.moveTo(startX, startY);
          ctx?.lineTo(toX, toY);
          ctx!.strokeStyle =
            localStorage.getItem("edgeColor") !== null
              ? localStorage.getItem("edgeColor")!
              : "#008000";
          ctx!.lineWidth = 15;
          ctx!.stroke();
        }
        startX = toX;
        startY = toY;
      }
    }
  }

  return <canvas ref={canvasRef} height={3400} width={5000} />;
}
