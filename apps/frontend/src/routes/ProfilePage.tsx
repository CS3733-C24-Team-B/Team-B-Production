import React, {useEffect, useState} from "react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/profile_page.css";
import {useAuth0} from "@auth0/auth0-react";
//import AuthenticationButton from "../components/AuthenticationButton.tsx";
import axios from "axios";
import {Button, CircularProgress} from "@mui/material";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import PieChartStats from "../components/Statistics/PieChartStats.tsx";
import ServiceRequestData from "../components/ServiceRequestData.tsx";

import {
    InternalTransportRequest,
    LanguageRequest,
    MaintenanceRequest,
    MedicineRequest,
    SanitationRequest
} from "common/src/serviceRequestTypes.ts";
import {EmployeeWithSR} from "database";


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
    const {user, isAuthenticated, getAccessTokenSilently, logout} = useAuth0();
    const [srData, setSRData] = useState<ServiceRequest[]>([]);
    const [employee, setEmployee] = useState<EmployeeWithSR>();
    const [employees, setEmployees] = useState<EmployeeWithSR[]>([]);
    const [, setFirstName] = useState("");
    const [, setLastName] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [refresh, setRefresh] = useState(false);

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

            const res3 = await axios.get("/api/employee/", {
                params: {
                    email: user!.email!
                },
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setEmployees(res3.data);
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


    useEffect(() => {
        async function fetch() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/service-request", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setSRData(res.data);
        }

        fetch().then();
    }, [getAccessTokenSilently, user]);

console.log(employees);
    const filterSR = srData.filter((sr: ServiceRequest) => {
        return sr.assignedID === user!.email!;
    });
    console.log(filterSR);

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


    function getCompleted() {
        return ServiceRequestData("completed");
    }

    function getAssigned() {
        return ServiceRequestData("assigned");
    }

    function getAvailable() {
        return ServiceRequestData("available");
    }

    function getRequests() {
        return ServiceRequestData("requests");
    }



    return (
        <div className={"Profile-Container"}>
            <Topbar/>
            <Navbar/>
            <div className={"BackBlue"}>
                <div className={"Profile-page-TwoColumns"}>
                    <div className={"Profile-page-TwoRows"}>
                        <div className={"Profile-pic-main-TestCard"}>
                            {(user === undefined || employee === undefined) ? (
                                <>
                                    <CircularProgress/>
                                    <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}} onClick={() => logout()}>
                                        Log Out
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div className="Profile-page-pic" style={{
                                        overflow: 'hidden',
                                        borderRadius: '50%',
                                        border: '2px solid #34AD84',
                                        maxHeight: '24vh',
                                        maxWidth: '24vh'
                                    }}>
                                        <label htmlFor={"newProfilePicture"}>
                                            <img src={profilePicture} alt="profile picture"
                                                 style={{
                                                     width: 'auto',
                                                     height: 'auto',
                                                     borderRadius: '50%',
                                                     maxHeight: '24vh',
                                                     justifySelf: 'center'
                                                 }}/>
                                        </label>
                                        <input accept="image/png, image/jpeg"
                                               id="newProfilePicture" type="file" onChange={uploadProfilePicture}/>
                                    </div>
                                    <div className={"Profile-page-text"}>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Name: {(employee?.firstName + " " + employee?.lastName)}
                                        </p>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Email: {employee?.email}
                                        </p>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Phone Number: +1-(888)-888-8888
                                        </p>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Job Title: Hospital Admin
                                        </p>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Department: IT
                                        </p>
                                        <p className={"Profile-page-firstcard-text"}>
                                            Birthday: {(employee?.birthday === null) ? (new Date()).toDateString() : employee?.birthday.toDateString()}
                                        </p>
                                    </div>
                                    <div className={"Profile-page-edit-button"}>
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}>
                                            Update Info
                                        </Button>
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}} onClick={() => logout()}>
                                            Log Out
                                        </Button>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                    <div className={"Profile-page-ThreeRows"}>
                        <div className={"ThreeColumnsFirstRow"}>
                            <div className={"Profile-page-top-infocards"}>
                                <div className="InfoContainer" style={{position: 'relative'}}>
                                    <div className="CircleBackground"></div>
                                    <CheckOutlinedIcon/>
                                </div>
                                <div className="TextContainer">
                                    <div className="Text">
                                        <p className={"Profile-page-top-infotext"}>Requests Completed</p>
                                    </div>
                                    <div className="Number">
                                        <p className={"Profile-page-top-infotext"}>{getCompleted()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={"Profile-page-top-infocards"}>
                                <div className="InfoContainer" style={{position: 'relative'}}>
                                    <div className="CircleBackground"></div>
                                    <ContentPasteOutlinedIcon/>
                                </div>
                                <div className="TextContainer">
                                    <div className="Text">
                                        <p className={"Profile-page-top-infotext"}>Requests Assigned</p>
                                    </div>
                                    <div className="Number">
                                        <p className={"Profile-page-top-infotext"}>{getAssigned()}</p>
                                    </div>
                                </div>
                            </div>
                            <div className={"Profile-page-top-infocards"}>
                                <div className="InfoContainer" style={{position: 'relative'}}>
                                    <div className="CircleBackground"></div>
                                    <ExtensionOutlinedIcon/>
                                </div>
                                <div className="TextContainer">
                                    <div className="Text">
                                        <p className={"Profile-page-top-infotext"}>Requests Available</p>
                                    </div>
                                    <div className="Number">
                                        <p className={"Profile-page-top-infotext"}>{getAvailable()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className={"Profile-page-TwoColumnsSecondRow"}>
                            <div className={"Profile-page-myreqcard"}>
                                <p className={"Profile-page-top-infotext-return"}>My Requests</p>
                                <div className={"Profile-page-top-infotext-scroll"}>
                                    <p className={"Profile-page-top-infotext"}>{getRequests()}</p>
                                </div>
                            </div>
                            <div className={"Profile-page-TwoColumnsSecondRow-SecondRows"}>
                                <div className={"SecondRow_SecondColumn-TestCard"}>
                                    <PieChartStats srlist={filterSR} title={"My Requests"}/>
                                </div>
                                <div className={"SecondRow_SecondColumn-TestCard"}>
                                    <p className={"Profile-page-top-infotext-return"}>Next Birthday</p>
                                    <div className={"Profile-page-top-infotext-scroll"}>
                                        <p className={"Profile-page-top-infotext"} style={{fontSize:50,color: "#34AD84"}}>Kenny Doan!</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
