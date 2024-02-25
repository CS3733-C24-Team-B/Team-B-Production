import React, {useEffect, useState} from 'react';
import {Typography, Button, TextField, CircularProgress, Snackbar, Alert} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import {EmployeeWithSR, ServiceRequestWithTypes} from "database";
import axios from "axios";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import "../css/profile_page.css";
import Topbar from "../components/Topbar.tsx";
import Navbar from "../components/Navbar.tsx";

export default function ProfilePage() {
    const {loginWithRedirect, user, isAuthenticated, isLoading, logout, getAccessTokenSilently} = useAuth0();
    const [employee, setEmployee] = useState<EmployeeWithSR>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [submitAlert, setSubmitAlert] = useState(false);
    const [refresh, setRefresh] = useState(false);

    function getReqType(nsr: ServiceRequestWithTypes) {
        if (nsr.sanitation) {
            return "Sanitation";
        } else if (nsr.medicine) {
            return "Medicine";
        } else if (nsr.maintenance) {
            return "Maintenance";
        } else if (nsr.internalTransport) {
            return "Internal Transport";
        } else if (nsr.language) {
            return "Language";
        }
        return "";
    }

    useEffect(() => {
        async function getData() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/employee/" + user!.email, {
                params: {
                    email: user!.email!
                },
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            const res2 = await axios.get("/api/employee/profile-picture/" + user!.email, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    responseType: "arraybuffer"
                }
            });

            setEmployee(res.data);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);

            if (res2.data) {
                setProfilePicture("data:image;base64," + res2.data);
            } else {
                setProfilePicture(user!.picture!);
            }
        }

        getData().then();
    }, [refresh, getAccessTokenSilently, user, isAuthenticated]);

    const listItemStyle = {marginLeft: '20px', marginBottom: '20px', fontFamily: 'Lato'};

    const arrayReq = (employee === undefined) ? [] : employee.requestsAssigned.map((nsr: ServiceRequestWithTypes) =>
        <div key={nsr.serviceID} style={listItemStyle}>
            <Typography>
                <strong>Requester:</strong> {"hi"}
            </Typography>
            <Typography>
                <strong>Type:</strong> {getReqType(nsr)}
            </Typography>
            <Typography>
                <strong>Priority:</strong> {nsr.priority}
            </Typography>
            <Typography>
                <strong>Status:</strong> {nsr.status}
            </Typography>
        </div>
    );

    async function uploadProfilePicture() {
        console.log("Uploading new profile picture");

        const formData = new FormData();
        const newProfilePicture = document.querySelector('#newProfilePicture') as HTMLInputElement;
        if (newProfilePicture == null) {
            console.log("image file is null");
            return;
        }

        formData.append("newProfilePicture", newProfilePicture.files![0]); // Update based on backend
        const accessToken: string = await getAccessTokenSilently();
        await axios.post("/api/employee/profile-picture/" + employee!.email, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: "Bearer " + accessToken
            }
        });
        setRefresh(!refresh);
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

    if (!isLoading && !isAuthenticated) {
        loginWithRedirect().then();
        return;
    }

    return (
        <div className="Profile-Container">
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <Navbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}>
                <div className="Profile-TwoRows">
                    <div className={"Profile-Card"}> {/* Increased marginRight */}
                        <Typography variant="h5" gutterBottom style={listItemStyle}>
                            Profile Information
                        </Typography>
                        {(user === undefined || employee === undefined) ? <> <CircularProgress/> <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}
                                                                                                         onClick={() => logout()}>
                                Log Out
                            </Button> </>:
                            <div className={"profile-card-info"}>

                                <div className={"profile-picture-wrapper"}>
                                    <img src={profilePicture} alt="profile picture" className={"profile-picture"}/>
                                    <input className={"profile-picture-input"} accept="image/png, image/jpeg"
                                           id="newProfilePicture" type="file" onChange={uploadProfilePicture}/>
                                </div>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Email:</strong> {employee.email}
                                </Typography>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Phone Number:</strong> {employee.phoneNumber}
                                </Typography>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Job Title:</strong> {employee.jobTitle}
                                </Typography>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Department:</strong> {employee.department}
                                </Typography>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Birthday:</strong> {(employee.birthday === null) ?
                                    (new Date()).toDateString() : employee.birthday.toDateString()}
                                </Typography>
                                <br/>
                                <TextField style={listItemStyle} id="standard-basic" label="First name"
                                           variant="standard"
                                           value={firstName}
                                           onChange={(e) => {
                                               setFirstName(e.target.value);
                                           }}
                                           required
                                />
                                <TextField style={listItemStyle} id="standard-basic" label="Last name"
                                           variant="standard"
                                           value={lastName}
                                           onChange={(e) => {
                                               setLastName(e.target.value);
                                           }}
                                           required
                                />
                                <div className={"profile-action-buttons"}>
                                    <div style={{marginTop: '20px'}}>
                                        <Button variant="contained" color="primary" onClick={submit}
                                                style={{backgroundColor: "#34AD84", fontFamily: 'Lato'}}>
                                            Update Info
                                        </Button>
                                    </div>
                                    <div style={{marginTop: '20px'}}>
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}
                                                onClick={() => {
                                                    getAccessTokenSilently().then((accessToken: string) => {
                                                        axios.get("/api/employee/reset-password/" + employee.email, {
                                                            headers: {
                                                                Authorization: "Bearer " + accessToken
                                                            }
                                                        }).then((res) => {
                                                            location.href = res.data;
                                                        });
                                                    });
                                                }}>
                                            Change Password
                                        </Button>
                                    </div>
                                    <div style={{marginTop: '20px'}}>
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}
                                                onClick={() => logout()}>
                                            Log Out
                                        </Button>
                                    </div>
                                </div>
                            </div>}
                    </div>
                    <div className={"Profile-Card"}> {/* Increased marginTop */}
                        <Typography variant="h5" gutterBottom style={listItemStyle}>
                            Service Requests
                        </Typography>
                        {(employee === undefined) ? <CircularProgress/> :
                            <div className={"profile-card-reqlist"}>
                                {(arrayReq.length === 0) ? "You have no requests at the moment :)" : arrayReq}
                            </div>
                        }
                    </div>
                </div>
            </div>
            <Snackbar
                anchorOrigin={{vertical: "top", horizontal: "center"}}
                open={submitAlert}
                autoHideDuration={2000}
                onClose={() => {
                    setSubmitAlert(false);
                }}>
                <Alert
                    severity="success"
                    sx={{width: '100%'}}
                >
                    Profile info updated.
                </Alert>
            </Snackbar>
        </div>
    );
}
