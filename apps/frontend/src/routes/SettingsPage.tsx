import React, {useState} from 'react';
import {Button, Container, Paper, Typography} from '@mui/material';
import Navbar from "../components/Navbar.tsx";

export default function SettingsPage() {
    const [nodeColor, setNodeColor] = useState(localStorage.getItem("nodeColor"));
    const [edgeColor, setEdgeColor] = useState(localStorage.getItem("edgeColor"));

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="profile-data">
                <div className="topbar-container2">
                    <div className="node-data-header">
                        <header className={'headerblue'}>Settings</header>
                    </div>
                </div>
                <Container> {/* Increased marginRight */}
                    <Paper elevation={3} style={{
                        padding: '30px',
                        width: '80%',
                        marginTop: '20px',
                        marginRight: '10%',
                        float: 'left'
                    }}>
                        <Typography variant="h5" gutterBottom>
                            {"Settings"}
                        </Typography>
                        <div>
                            <input type="color" value={(nodeColor === null ? "#3388ff" : nodeColor!)}
                                   onChange={(e) => {
                                       localStorage.setItem("nodeColor", e.target.value);
                                       setNodeColor(e.target.value);
                                   }}/>
                            <Button onClick={() => {
                                localStorage.removeItem("nodeColor");
                                setNodeColor(null);
                            }}>
                                Reset Node Color
                            </Button>
                        </div>
                        <div>
                            <input type="color" value={(edgeColor === null ? "#008000" : edgeColor!)}
                                   onChange={(e) => {
                                       localStorage.setItem("edgeColor", e.target.value);
                                       setEdgeColor(e.target.value);
                                   }}/>
                            <Button onClick={() => {
                                localStorage.removeItem("edgeColor");
                                setEdgeColor(null);
                            }}>
                                Reset Edge Color
                            </Button>
                        </div>
                    </Paper>
                </Container>
            </div>
        </div>
    );
}
