//import {MapContainer, ImageOverlay} from 'react-leaflet';
import {MapContainer, Marker, Popup, ImageOverlay} from 'react-leaflet';
import "../css/leaflet.css";
import {LatLngBounds, LatLng} from "leaflet";
import {useState, useEffect} from "react";
import axios from "axios";
//import L from "leaflet";

export default function LeafletMap() {
    const [nodeData, setNodeData] = useState([]);
    const [edgeData, setEdgeData] = useState([]);

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

            setNodeData(res.data);
            setEdgeData(res3.data);
        }
        fetch().then();
    }, []);

    console.log(nodeData);
    console.log(edgeData);

    return (
        <MapContainer center={[50, 0]} zoom={2}
                      //minZoom={5}
                      scrollWheelZoom={true}
                      // maxBoundsViscosity={1.0}
                      // maxBounds={new LatLngBounds(new LatLng(0, 0), new LatLng(50, 100))}
        >
            {/*<TileLayer*/}
            {/*    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'*/}
            {/*    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"*/}
            {/*    //url="src/images/00_thegroundfloor.png"*/}
            {/*/>*/}
            <ImageOverlay
                url="src/images/00_thelowerlevel1.png"
                bounds={new LatLngBounds(new LatLng(0, 0), new LatLng(100, 300))}
            />
            <Marker position={[0, 300]}>
                <Popup>
                    A pretty CSS3 popup. <br /> Easily customizable.
                </Popup>
            </Marker>
            {nodeData.map(({longName, xcoord, ycoord, floor}) => (
                (floor === "L1" ?
                <Marker position={[ycoord*100/5000, xcoord*300/5000]}>
                    <Popup>
                        {longName + ": " + xcoord + ", " + ycoord}
                    </Popup>
                </Marker> : <></>)
            ))}
        </MapContainer>
    );
};
