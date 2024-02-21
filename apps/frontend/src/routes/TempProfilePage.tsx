import React, {useEffect, useState} from 'react';
import {Typography, Button, TextField, CircularProgress, Snackbar, Alert, List} from '@mui/material';
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import {
    InternalTransportRequest, LanguageRequest,
    MaintenanceRequest,
    MedicineRequest,
    SanitationRequest,
    RequestType
} from "common/src/serviceRequestTypes.ts";
import "../css/profile_page.css";
import Topbar from "../components/Topbar.tsx";
import TempNavbar from "../components/TempNavbar.tsx";

type ServiceRequest = {
    serviceID: number,
    timeCreated: string,
    createdBy: UpdateEmployee,
    createdByID: string,
    locationID: string,
    priority: string,
    status: string,
    assignedTo: UpdateEmployee,
    assignedID: string,
    notes: string,
    sanitation: SanitationRequest,
    maintenance: MaintenanceRequest,
    internalTransport: InternalTransportRequest,
    medicine: MedicineRequest,
    language: LanguageRequest,
}

export default function ProfilePage() {
    const {loginWithRedirect, user, isAuthenticated, isLoading, logout, getAccessTokenSilently} = useAuth0();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [srData, setSRData] = useState([]);
    const [receivedSR, setReceivedSR] = useState(false);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [employeeData, setEmployeeData] = useState([]);

    function getReqType(nsr: ServiceRequest) {
        if (nsr.sanitation) {
            return "sanitation";
        } else if (nsr.medicine) {
            return "medicine";
        } else if (nsr.maintenance) {
            return "maintenance";
        } else if (nsr.internalTransport) {
            return "internalTransport";
        } else if (nsr.language) {
            return "language";
        }
        return "";
    }

    function getNameOrEmail(userEmail: string) {
        let outFirst = "";
        let outLast = "";
        let outEmail = "";
        employeeData.find(({email, firstName, lastName}) => {
            if (userEmail === email) {
                outFirst = firstName;
                outLast = lastName;
                outEmail = email;
                return true;
            }
        });
        return (outFirst === null || outLast === null) ? outEmail : outFirst + " " + outLast;
    }

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
            const res3 = await axios.get(`/api/employee`, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            if (res.status == 200) {
                console.log("Successfully submitted form");
            }

            setEmail(res.data.email);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
            setSRData(res2.data);
            setEmployeeData(res3.data);
            setReceivedSR(true);
        }

        submit().then();
    }, [getAccessTokenSilently, user, isAuthenticated]);

    const listItemStyle = {marginLeft: '20px', marginBottom: '20px'};

    const arrayReq = srData.map((nsr: ServiceRequest) =>
        <List>
            {((nsr.assignedID === email) ? <div key={nsr.serviceID} style={listItemStyle}>
                <Typography>
                    <strong>Requester:</strong> {getNameOrEmail(nsr.createdByID)}
                </Typography>
                <Typography>
                    <strong>Type:</strong> {RequestType[getReqType(nsr) as keyof typeof RequestType]}
                </Typography>
                <Typography>
                    <strong>Priority:</strong> {nsr.priority}
                </Typography>
                <Typography>
                    <strong>Status:</strong> {nsr.status}
                </Typography>
            </div> : null)}
        </List>
    );

    function allNull(arr: (object | null)[]) {
        for (const obj of arr) {
            if (obj !== null) {
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

    if (!isLoading && !isAuthenticated) {
        loginWithRedirect().then();
        return;
    }

    return (
        <div className="Profile-Container">
            <Topbar/> {/* TopGreen css fixes this to the top */}
            <TempNavbar/> {/* NavBlue css fixes this to the left */}
            <div className={"BackBlue"}>
                <div className="Profile-TwoRows">
                    <div className={"Profile-Card"}> {/* Increased marginRight */}
                            <Typography variant="h5" gutterBottom style={{marginLeft: '5%'}}>
                                Profile Information
                            </Typography>
                            {(user === undefined) ? <CircularProgress/> : <div className={"profile-card-info"}>
                                <Typography variant="body1" style={listItemStyle}>
                                    <strong>Email:</strong> {email}
                                </Typography>
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
                                <div style={{marginTop: '20px'}}>
                                    <Button variant="contained" color="primary" onClick={submit}
                                            style={{backgroundColor: "#34AD84"}}>
                                        Update Info
                                    </Button>
                                </div>
                                <div style={{marginTop: '20px'}}>
                                    <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}
                                            onClick={() => {
                                                getAccessTokenSilently().then((accessToken: string) => {
                                                    axios.get("/api/employee/reset-password/" + email, {
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
                            </div>}
                    </div>
                    <div className={"Profile-Card"}> {/* Increased marginTop */}
                            <Typography variant="h5" gutterBottom style={{marginLeft: '5%'}}>
                                Service Requests
                            </Typography>
                            {(!receivedSR) ? <CircularProgress/> : <div className={"profile-card-reqlist"}>
                                {(arrayReq.length === 0 || allNull(arrayReq)) ? "You have no requests at the moment :)" : arrayReq} </div>}
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
