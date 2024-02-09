import {MapContainer, Tooltip, ImageOverlay, CircleMarker} from 'react-leaflet';
import "../css/leaflet.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {LatLng, LatLngBounds} from "leaflet";
// import L from "leaflet";
//import {CircleMarker, Tooltip} from "react-leaflet";

export default function LeafletMap() {
    const [nodeData, setNodeData] = useState([]);
    //const [edgeData, setEdgeData] = useState([]);
    const [nodeStart, setNodeStart] = useState("");
    const [nodeEnd, setNodeEnd] = useState("");
    const [drawLine, setDrawLine] = useState(false);
    //const [pathData, setPathData] = useState([]);
    // const [map] = useState(L.map("mapid", {
    //     scrollWheelZoom: true,
    //     maxBoundsViscosity: 1.0,
    // }));
    // map.setView([17, 25], 5);
    // map.setMinZoom(5);
    // map.setMaxBounds([[0, 0], [34, 50]]);
    // map.addLayer(L.imageOverlay("src/images/00_thelowerlevel1.png", [[0, 0], [34, 50]]));

    useEffect(() => {
        async function fetch() {
            try {
                const res2 = await axios.post("/api/db-insert");
                console.log(res2.data);
            } catch {
                console.log("post error");
            }
            const res = await axios.get("/api/db-load-nodes");
            //const res3 = await axios.get("/api/db-load-edges");

            setNodeData(res.data);
            //setEdgeData(res3.data);
        }

        fetch().then();
    }, []);
    
    // useEffect(() => {
    //     async function fetch() {
    //         const res2 = await axios.get(`/api/db-get-path/${nodeStart}/${nodeEnd}`);
    //         setPathData(res2.data);
    //     }
    //     fetch().then();
    // }, [nodeEnd, nodeStart]);

    // useEffect(() => {
    //     // setMap(L.map("mapid", {
    //     //               scrollWheelZoom: true,
    //     //               maxBoundsViscosity: 1.0,
    //     // }));
    //
    //     const nameToXPos = (name : string) => {
    //         return nodeData.find(({longName}) =>
    //             name === longName
    //         )!["xcoord"];
    //     };
    //
    //     const nameToYPos = (name : string) => {
    //         return nodeData.find(({longName}) =>
    //             name === longName
    //         )!["ycoord"];
    //     };
    //
    //     const nameToFloor = (name : string) => {
    //         return nodeData.find(({longName}) =>
    //             name === longName
    //         )!["floor"];
    //     };
    //
    //     let startX = -1;
    //     let startY = -1;
    //     pathData.map((nr) => {
    //         if(nameToFloor(nr) === "L1") {
    //             if(startX >= 0 && startY >= 0) {
    //                 new L.Polyline([new LatLng(startX, startY), new LatLng(nameToXPos(nr), nameToYPos(nr))]).addTo(map);
    //             }
    //             startX = nameToXPos(nr);
    //             startY = nameToYPos(nr);
    //         }
    //     });
    // }, [nodeData, pathData]);

    console.log(nodeStart);
    
    return (
        // <div id="mapid">
        //     {nodeData.map(({nodeID, longName, xcoord, ycoord, floor}) => (
        //                 (floor === "L1" ?
        //                 <CircleMarker center={new LatLng(34.8-(ycoord*34/3400), xcoord*50/5000)} radius={6} eventHandlers={{
        //                     click: () => {
        //                         console.log("TEST: " + longName);
        //                         if(drawLine) {
        //                             setNodeStart(nodeEnd);
        //                             setNodeEnd(nodeID);
        //                         } else {
        //                             setNodeEnd(nodeID);
        //                             setDrawLine(true);
        //                         }
        //                     }
        //                 }}>
        //                     <Tooltip>
        //                         {longName + ": " + xcoord + ", " + ycoord}
        //                     </Tooltip>
        //                 </CircleMarker> : <></>)
        //             ))}
        // </div>
        <MapContainer center={[17, 25]} zoom={5}
                      minZoom={5}
                      scrollWheelZoom={true}
                      maxBoundsViscosity={1.0}
                      maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
                      id={"mapid"}
        >
            <ImageOverlay
                url="src/images/00_thelowerlevel1.png"
                bounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 50))}
            />
            {nodeData.map(({nodeID, longName, xcoord, ycoord, floor}) => (
                (floor === "L1" ?
                <CircleMarker center={new LatLng(34.8-(ycoord*34/3400), xcoord*50/5000)} radius={6} eventHandlers={{
                    click: () => {
                        console.log("TEST: " + longName);
                        if(drawLine) {
                            setNodeStart(nodeEnd);
                            setNodeEnd(nodeID);
                        } else {
                            setNodeEnd(nodeID);
                            setDrawLine(true);
                        }
                    }
                }}>
                    <Tooltip>
                        {longName + ": " + xcoord + ", " + ycoord}
                    </Tooltip>
                </CircleMarker> : <></>)
            ))}
        </MapContainer>
    );
};
