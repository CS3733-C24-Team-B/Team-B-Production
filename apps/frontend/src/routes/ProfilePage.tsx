import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography, Button, TextField, CircularProgress, Snackbar, Alert} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import Navbar from "../components/Navbar.tsx";

export default function ProfilePage() {
    const {loginWithRedirect, user, isAuthenticated, getAccessTokenSilently} = useAuth0();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [srData, setSRData] = useState([]);
    const [receivedSR, setReceivedSR] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);

    useEffect(() => {
        async function submit() { ///copied
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get(`/api/employee/${user!.email!}`, {
                params: {
                    email: user!.email!
                },
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const res2 = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            if (res.status == 200) {
                console.log("Successfully submitted form");
            }
            console.log(res.data);
            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
            setSRData(res2.data);
            setReceivedSR(true);
        }

        submit().then();
    }, [getAccessTokenSilently, user, isAuthenticated]);

    const listItemStyle = {marginLeft: '20px', marginBottom: '20px'};

    const arrayReq = srData.map(({serviceID, createdByID, status, notes, assignedID, priority}) =>
        ((assignedID === email) ? <div key={serviceID} style={listItemStyle}>
            <Typography>
                <strong>Requester:</strong> {createdByID}
            </Typography>
            <Typography>
                <strong>Type:</strong> {notes.split(",")[0]}
            </Typography>
            <Typography>
                <strong>Priority:</strong> {priority}
            </Typography>
            <Typography>
                <strong>Status:</strong> {status}
            </Typography>
        </div> : null)
    );

    function allNull(arr:(object|null)[]) {
        for(const obj of arr) {
            if(obj !== null) {
                return false;
            }
        }
        return true;
    }

    async function submit() { ///copied
        const employeeInfo: UpdateEmployee = {
            email: user!.email!,
            firstName: firstName,
            lastName: lastName
        };
        const accessToken: string = await getAccessTokenSilently();
        const res = await axios.put("/api/employee", employeeInfo, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        });
        if (res.status == 200) {
            console.log("Successfully submitted form");
            setSubmitAlert(true);
        }
    }

    if (!isAuthenticated) {
        loginWithRedirect().then();
        return;
    }

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="profile-data">
                <div className="topbar-container2">
                    <div className="node-data-header">
                        <header className={'headerblue'}>Profile</header>
                    </div>
                </div>
                <Container> {/* Increased marginRight */}
                    <Paper elevation={3} style={{
                        padding: '30px',
                        width: '45%',
                        marginTop: '20px',
                        marginRight: '10%',
                        float: 'left'
                    }}>
                        <Typography variant="h5" gutterBottom>
                            Profile Information
                        </Typography>
                        {(user === undefined) ? <CircularProgress /> : <div>
                            <Typography variant="body1" style={listItemStyle}>
                                <strong>Email:</strong> {email}
                            </Typography>
                            <TextField style={listItemStyle} id="standard-basic" label="First name" variant="standard"
                                       value={firstName}
                                       onChange={(e) => {
                                           setFirstName(e.target.value);
                                       }}
                                       required
                            />
                            <TextField style={listItemStyle} id="standard-basic" label="Last name" variant="standard"
                                       value={lastName}
                                       onChange={(e) => {
                                           setLastName(e.target.value);
                                       }}
                                       required
                            />
                            <div style={{marginTop: '20px'}}>
                                <Button variant="contained" color="primary" onClick={submit}
                                        style={{backgroundColor: "#012D5A"}}>
                                    Update Info
                                </Button>
                            </div>
                        </div>}
                    </Paper>
                </Container>
                <Container style={{marginTop: '20px'}}> {/* Increased marginTop */}
                    <Paper elevation={3} style={{padding: '30px', width: '45%', float: 'right'}}>
                        <Typography variant="h5" gutterBottom>
                            Service Requests
                        </Typography>
                        {(!receivedSR) ? <CircularProgress /> :
                            (arrayReq.length === 0 || allNull(arrayReq)) ? "You have no requests at the moment :)" : arrayReq}
                    </Paper>
                </Container>
            </div>
            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={submitAlert}
                autoHideDuration={2000}
                onClose={() => {
                    setSubmitAlert(false);
                }}>
                <Alert
                    severity="success"
                    sx={{ width: '100%' }}
                >
                    Profile info updated.
                </Alert>
            </Snackbar>
        </div>
    );
}
