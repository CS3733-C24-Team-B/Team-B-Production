import {MapContainer, Tooltip, ImageOverlay, CircleMarker} from 'react-leaflet';
import "../../css/leaflet.css";
import React, {useState, useEffect} from "react";
import axios from "axios";
import {LatLng, LatLngBounds} from "leaflet";
import {
    CircularProgress
} from "@mui/material";
import {useAuth0} from "@auth0/auth0-react";
import lowerlevel1 from "../../images/00_thelowerlevel1.png";
import lowerlevel2 from "../../images/00_thelowerlevel2.png";
import firstfloor from "../../images/01_thefirstfloor.png";
import secondfloor from "../../images/02_thesecondfloor.png";
import thirdfloor from "../../images/03_thethirdfloor.png";

const FloorLevel = [
    {
        floor: lowerlevel2,
        level: "L2"
    },
    {
        floor: lowerlevel1,
        level: "L1"
    },
    {
        floor: firstfloor,
        level: "1"
    },
    {
        floor: secondfloor,
        level: "2"
    },
    {
        floor: thirdfloor,
        level: "3"
    }
];

export default function LeafletMiniMap(props : {change: (arg0: string) => void, setClose: (arg0: boolean) => void}) {
    const {change, setClose} = props;
    const [nodeData, setNodeData] = useState([]);
    const [currLevel, setCurrLevel] = useState("L1");
    const [selectedFloor, setSelectedFloor] = useState(lowerlevel1);

    useEffect(() => {
        async function fetch() {

            const res3 = await axios.get("/api/nodes/read");
            setNodeData(res3.data);
        }

        fetch().then();
    }, []);

    // get auth0 stuff
    const {isLoading} = useAuth0();

    // add this before return statement so if auth0 is loading it shows a loading thing or if user isn't authenticated it redirects them to login page
    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    return (
        <div style={{maxHeight: '100%'}}>
            <MapContainer
                center={[20, 28]}
                zoomSnap={0.5}
                zoomDelta={0.5}
                zoom={5.5}
                minZoom={5}
                maxZoom={8}
                scrollWheelZoom={true}
                maxBoundsViscosity={1.0}
                maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(34, 56))}
                className={"leaflet-container"}
            >
                <ImageOverlay
                    url={selectedFloor}
                    bounds={new LatLngBounds(new LatLng(0, 3), new LatLng(34, 53))}
                />
                {nodeData.map(({nodeID, longName, xcoord, ycoord, floor, nodeType}) => (
                    (floor === currLevel && nodeType !== "HALL") ?
                        <CircleMarker center={new LatLng(34.8 - (ycoord * 34 / 3400), (xcoord * 50 / 5000) + 3)}
                                      radius={6}
                                      eventHandlers={{
                                          click: () => {
                                              change(nodeID);
                                              setClose(false);
                                          }
                                      }}>
                            <Tooltip>
                                <div>
                                    {longName}
                                </div>
                            </Tooltip>
                        </CircleMarker> : <></>)
                )}
            </MapContainer>
            <div className="floor-buttons">
                {FloorLevel.slice().reverse().map(({floor, level}) => (
                    <button
                        key={floor}
                        className={`mui-btn mui-btn--fab ${currLevel === level ? 'selected' : ''}`}
                        onClick={() => {
                            setSelectedFloor(floor);
                            setCurrLevel(level);
                        }}
                    >
                        {level}
                    </button>
                ))}
            </div>
        </div>
    );
}
