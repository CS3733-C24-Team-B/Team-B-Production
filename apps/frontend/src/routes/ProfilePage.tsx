import React, {useEffect, useState} from 'react';
import {Container, Paper, Typography, Button, TextField} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import Navbar from "../components/Navbar.tsx";

export default function ProfilePage() {
    const {user, isAuthenticated} = useAuth0();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [srData, setSRData] = useState([]);

    useEffect(() => {
        async function submit() { ///copied
            const res = await axios.get(`/api/employee/${user!.email!}`, {
                params: {
                    email: user!.email!
                }
            });
            const res2 = await axios.get("/api/service-request");

            if (res.status == 200) {
                console.log("Successfully submitted form");
            }
            console.log(res.data);
            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
            setSRData(res2.data);
        }

        submit().then();
    }, [user, isAuthenticated]);

    const listItemStyle = {marginLeft: '20px', marginBottom: '20px'};

    const arrayReq = srData.map(({serviceID, name, status, infoText, assignedID}) =>
        ((assignedID === email) ? <div key={serviceID} style={listItemStyle}>
            <Typography>
                <strong>Requester:</strong> {name}
            </Typography>
            <Typography>
                <strong>Description:</strong> {infoText}
            </Typography>
            <Typography>
                <strong>Status:</strong> {status}
            </Typography>
        </div> : null)
    );
    // const profileData = {
    //     firstName: firstName,
    //     lastName: lastName,
    //     age: 30,
    //     phoneNumber: '123-456-7890',
    //     username: email,
    //     password: '********',
    //     ssn: '123-45-6789',
    //     serviceRequests: [
    //         reqList
    //         // {id: 1, description: 'Request 1', status: 'Fulfilled'},
    //         // {id: 2, description: 'Request 2', status: 'In Progress'},
    //         // {id: 3, description: 'Request 3', status: 'Submitted'},
    //     ],
    // };

    // const handlePasswordChange = () => {
    //     // Implement the logic to redirect to the password change page
    //     window.location.href = '/change-profile';
    // };

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
        const res = await axios.put("/api/employee", employeeInfo, {
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (res.status == 200) {
            console.log("Successfully submitted form");
        }
    }

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="profile-data">
                <Container> {/* Increased marginRight */}
                    <Paper elevation={3} style={{padding: '30px', width: '45%', marginTop: '20px', marginRight: '10%', float: 'left'}}>
                        <Typography variant="h5" gutterBottom>
                            Profile Information
                        </Typography>
                        <Typography variant="body1" style={listItemStyle}>
                            <strong>Email:</strong> {email}
                        </Typography>
                        {/*<Typography variant="body1" style={listItemStyle}>*/}
                        {/*    <strong>First Name:</strong> {profileData.firstName}*/}
                        {/*</Typography>*/}
                        <TextField style={listItemStyle} id="standard-basic" label="First name" variant="standard"
                                   value={firstName}
                                   onChange={(e) => {
                                       setFirstName(e.target.value);
                                   }}
                                   required
                        />
                        {/*<Typography variant="body1" style={listItemStyle}>*/}
                        {/*    <strong>Last Name:</strong> {profileData.lastName}*/}
                        {/*</Typography>*/}
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
                    </Paper>
                </Container>
                <Container style={{marginTop: '20px'}}> {/* Increased marginTop */}
                    <Paper elevation={3} style={{padding: '30px', width: '45%', float: 'right'}}>
                        <Typography variant="h5" gutterBottom>
                            Service Requests
                        </Typography>
                        {(arrayReq.length === 0 || allNull(arrayReq)) ? "You have no requests at the moment :)" : arrayReq}
                        {/*{reqList.map(({id, description, status}) => (*/}
                        {/*    <div key={id} style={listItemStyle}>*/}
                        {/*        <Typography>*/}
                        {/*            <strong>Description:</strong> {description}*/}
                        {/*        </Typography>*/}
                        {/*        <Typography>*/}
                        {/*            <strong>Status:</strong> {status}*/}
                        {/*        </Typography>*/}
                        {/*    </div>*/}
                        {/*))}*/}
                    </Paper>
                </Container>
            </div>
        </div>
    );
}
