import React, {useEffect, useRef, useState} from 'react';
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
// const minDrawSize = 3;
// const maxDrawSize = 8;

const Canvas = ({ width, height, imageSource, currLevel }: CanvasProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);
    // let startX = 0;
    // let startY = 0;
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [drawLine, setDrawLine] = useState(false);
    const [pathData, setPathData] = useState([]);
    //const [words, setPath] = useState([""]);
    const canvasCtxRef = React.useRef<CanvasRenderingContext2D | null>(null);
    const [ctx, setCtx] = useState(canvasCtxRef.current);
    const [showEdges, setShowEdges] = useState(false);
    const [useAStar, setUseAStar] = useState(false);

    function getDrawSize() {
        // if(drawSize < minDrawSize) {
        //     drawSize = minDrawSize;
        // } else if(drawSize > maxDrawSize) {
        //     drawSize = maxDrawSize;
        // }
        return (width + height) / 800;
    }

    async function handleClick(e: React.MouseEvent<HTMLCanvasElement>) {
        if(!showEdges) {
            const rect = e.currentTarget.getBoundingClientRect();
            // const xPosition = e.clientX - rect.left + (width / 160);
            // const yPosition = e.clientY - rect.top + (height / 120);
            nodeData.map(({nodeID, xcoord, ycoord,floor}) => {
                const xPos = xcoord * (width / widthRatio);
                const yPos = ycoord * (height / heightRatio);
                const xPosition = e.clientX - rect.left + (xPos / 26);
                const yPosition = e.clientY - rect.top + (yPos / 20);
                if (Math.abs(xPos - xPosition) < clickDist && Math.abs(yPos - yPosition) < clickDist&& floor===currLevel) {
                    if (drawLine) {
                            setNodeEnd(nodeStart);
                            setNodeStart(nodeID);
                    } else {
                        setNodeStart(nodeID);
                        setDrawLine(!drawLine);
                    }
                }
            });
        }
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if(!showEdges) {
            const rect = e.currentTarget.getBoundingClientRect();
            // const xPosition = e.clientX - rect.left + (width / 160);
            // const yPosition = e.clientY - rect.top + (height / 120);
            nodeData.map(({xcoord, ycoord, floor}) => {
                if (floor === currLevel) {
                    const xPos = xcoord * (window.innerWidth / widthRatio);
                    const yPos = ycoord * (window.innerHeight / heightRatio);
                    const xPosition = e.clientX - rect.left + (xPos / 26);
                    const yPosition = e.clientY - rect.top + (yPos / 20);
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
        }
    };

    const handleResize = () => {
        if(height != window.innerHeight || width != window.innerWidth) {
            height = parent.innerHeight;
            width = parent.innerWidth;
            console.log("TEST: " + width + " " + parent.innerWidth + " " + ctx?.canvas.width);
            if(ctx?.canvas != null) {
                ctx!.canvas.width = width;
                ctx!.canvas.height = height;
                requestAnimationFrame(() => draw());
            }
        }
        //requestAnimationFrame(() => draw());
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
            const res = await axios.get("/api/db-load-nodes");
            const res3 = await axios.get("/api/db-load-edges");

            console.log(res.data);
            console.log(res3.data);
            setNodeData(res.data);
            setEdgeData(res3.data);
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

        ctx!.clearRect(0, 0, width*10, height*10);

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

        const nameToFloor = (name : string) => {
            return nodeData.find(({longName}) =>
                name === longName
            )!["floor"];
        };

        function nodeIDtoName(nId : string) {
            return nodeData.find(({nodeID}) =>
                nodeID === nId
            )!["longName"];
        }

        if(showEdges) {
            edgeData.map(({startNodeID, endNodeID}) => {
                const startName = nodeIDtoName(startNodeID);
                const endName = nodeIDtoName(endNodeID);
                if(nameToFloor(startName) === currLevel && nameToFloor(endName) === currLevel) {
                    const startX = nameToXPos(startName) * (width / widthRatio);
                    const startY = nameToYPos(startName) * (height / heightRatio);
                    const endX = nameToXPos(endName) * (width / widthRatio);
                    const endY = nameToYPos(endName) * (height / heightRatio);
                    ctx!.beginPath();
                    ctx?.moveTo(startX, startY);
                    ctx?.lineTo(endX, endY);
                    ctx!.strokeStyle = "green";
                    ctx!.lineWidth = getDrawSize();
                    ctx!.stroke();
                }
            });
        } else if(pathData.length > 1) {
            let startX = -1;
            let startY = -1;
            for (const nr of pathData) {
                if(nameToFloor(nr) === currLevel) {
                    const xPos = nameToXPos(nr) * (window.innerWidth / widthRatio);
                    const yPos = nameToYPos(nr) * (window.innerHeight / heightRatio);

                    if(0<=pathData.indexOf(nr)-1&&nameToFloor(pathData[pathData.indexOf(nr)-1])!==currLevel){
                        ctx!.beginPath();
                        ctx.fillStyle="rgba(230,0,255,0.97)";
                        ctx!.font="bold 13pt arial";
                        ctx!.textAlign="center";
                        ctx!.fillText("Go to floor "+nameToFloor(pathData[pathData.indexOf(nr)-1]),xPos ,yPos-(height/90));
                        ctx!.stroke();
                    }
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
                else {
                    ctx.beginPath();
                    ctx.fillStyle="rgba(230,0,255,0.97)";
                    ctx.textAlign="center";
                    ctx!.font="bold 13pt arial";
                    ctx.fillText("Arrive from floor "+nameToFloor(nr),startX,startY-(height/90));
                    ctx.stroke();
                    ctx.fillStyle="blue";
                    startX = -1;
                    startY = -1;
                }
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


    useEffect(() => {
        async function fetch() {
            //  console.log(`${data.startNode}`);
            const res2 = await axios.get(`/api/db-get-path/currentAlg`);
            setUseAStar(res2.data);

        }
        fetch().then();
    }, []);

    return (
        <div>
            <label className="small-label">
                <input type="checkbox" onClick={() => {
                    setShowEdges(!showEdges);
                }}/>
                Show All Edges
            </label>
            <label className="small-label">
                <input type="checkbox" checked={useAStar} onClick={() => {
                    axios.post(`/api/db-get-path/change`);
                    setUseAStar(!useAStar);

                }}/>
                Use A*
            </label>
            <canvas ref={canvasRef} height={height} width={width} onClick={handleClick} onMouseMove={handleMouseMove}/>
        </div>

    );
};

Canvas.defaultProps = {
    width: window.innerWidth,
    height: window.innerHeight
};

export default Canvas;
