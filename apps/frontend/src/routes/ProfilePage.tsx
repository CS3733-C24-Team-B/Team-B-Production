import React, {useState, useEffect} from "react";
import Navbar from "../components/Navbar.tsx";
import Topbar from "../components/Topbar.tsx";
import "../css/profile_page.css";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import {DatePicker} from '@mui/x-date-pickers/DatePicker';
import {MuiTelInput} from 'mui-tel-input';
import {Button, CircularProgress} from "@mui/material";
import CheckOutlinedIcon from '@mui/icons-material/CheckOutlined';
import ContentPasteOutlinedIcon from '@mui/icons-material/ContentPasteOutlined';
import ExtensionOutlinedIcon from '@mui/icons-material/ExtensionOutlined';
import PieChartStats from "../components/Statistics/PieChartStats.tsx";
import {EmployeeWithSR, ServiceRequestWithTypes} from "database";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import TextField from "@mui/material/TextField";
import dayjs, {Dayjs} from "dayjs";

export default function ProfilePage() {
    const {user, getAccessTokenSilently, logout} = useAuth0();
    const [employee, setEmployee] = useState<EmployeeWithSR>();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [jobTitle, setJobTitle] = useState("");
    const [department, setDepartment] = useState("");
    const [birthday, setBirthday] = useState<Dayjs>();
    const [phoneNumber, setPhoneNumber] = useState("");
    const [profilePicture, setProfilePicture] = useState("");
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        async function getData() {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/employee/" + user!.email, {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });

            setEmployee(res.data);
            setFirstName(res.data.firstName);
            setLastName(res.data.lastName);
            setJobTitle(res.data.jobTitle);
            setDepartment(res.data.department);
            setBirthday(dayjs(res.data.birthday));
            setPhoneNumber(res.data.phoneNumber);

            const res2 = await axios.get("/api/employee/profile-picture/" + user!.email, {
                headers: {
                    Authorization: "Bearer " + accessToken,
                    responseType: "arraybuffer"
                }
            });

            if (res2.data) {
                setProfilePicture("data:image;base64," + res2.data);
            } else {
                setProfilePicture(user!.picture!);
            }

            setRefresh(false);

        }

        getData().then();
    }, [refresh, getAccessTokenSilently, user]);

    async function updateInfo() {
        console.log("updating profile info");
        const accessToken: string = await getAccessTokenSilently();
        const updatedEmployee: UpdateEmployee = {
            email: employee!.email,
            firstName: firstName,
            lastName: lastName,
            jobTitle: jobTitle,
            department: department,
            birthday: birthday!.toDate(),
            phoneNumber: phoneNumber
        };
        await axios.put("/api/employee", updatedEmployee, {
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken
            }
        });
        setRefresh(!refresh);
    }

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

    function getAssigned() {
        let count: number = 0;
        if (employee !== undefined) {
            employee.requestsAssigned.forEach(function (request) {
                if (request.status === "Assigned") {
                    count++;
                }
            });
        }
        return count;
    }

    function getInProgress() {
        let count: number = 0;
        if (employee !== undefined) {
            employee.requestsAssigned.forEach(function (request) {
                if (request.status === "In Progress") {
                    count++;
                }
            });
        }
        return count;
    }

    function getCompleted(): number {
        let count: number = 0;
        if (employee !== undefined) {
            employee.requestsAssigned.forEach(function (request) {
                if (request.status === "Completed") {
                    count++;
                }
            });
        }
        return count;
    }

    function getRequests() {
        if (employee === undefined) {
            return <div/>;
        }
        return (
            <div>
                <ul>{employee.requestsAssigned.map(obj =>
                    <div>
                        <div style={{color: "green", fontSize: 26}}>{getReqType(obj)}</div>
                        <div style={{fontSize: 18, marginBlockEnd: 20}}>Priority: {obj.priority}<br/>
                            Location: {obj.location === undefined ? "" : obj.location!.longName}<br/>
                            Notes: {obj.notes}</div>
                    </div>)}</ul>
            </div>);
    }

    return (
        <div className={"Profile-Container"}>
            <Topbar/>
            <Navbar/>
            {(user === undefined || employee === undefined) ? <CircularProgress/> : (
                <div className={"BackBlue"}>
                    <div className={"Profile-page-TwoColumns"}>
                        <div className={"Profile-page-TwoRows"}>
                            <div className={"Profile-pic-main-TestCard"}>
                                <div className="Profile-page-pic">
                                    <label htmlFor={"newProfilePicture"}>
                                        <img src={profilePicture} alt="profile picture"
                                             style={{
                                                 borderRadius: '50%',
                                                 justifySelf: 'center',
                                             }}/>
                                    </label>
                                    <input accept="image/png, image/jpeg"
                                           id="newProfilePicture" type="file" onChange={uploadProfilePicture}/>
                                </div>
                                <div className={"Profile-page-text"}>
                                    <p className={"Profile-page-firstcard-text"}>
                                        {employee?.email}
                                    </p>
                                    <TextField className={"Profile-page-firstcard-text"} id="standard-basic"
                                               label="First Name" variant="outlined" required
                                               value={firstName}
                                               onChange={(e) => setFirstName(e.target.value)}
                                               sx={{width: '15vw'}}/>
                                    <TextField className={"Profile-page-firstcard-text"} id="standard-basic"
                                               label="Last Name" variant="outlined" required
                                               value={lastName}
                                               onChange={(e) => setLastName(e.target.value)}
                                               sx={{width: '15vw'}}/>
                                    <MuiTelInput className={"Profile-page-firstcard-text"} label="Phone Number"
                                                 defaultCountry="US" forceCallingCode disableDropdown
                                                 value={phoneNumber} onChange={setPhoneNumber}
                                                 sx={{width: '15vw'}}/>
                                    <TextField className={"Profile-page-firstcard-text"} id="standard-basic"
                                               label="Job Title" variant="outlined" required
                                               value={jobTitle}
                                               onChange={(e) => setJobTitle(e.target.value)}
                                               sx={{width: '15vw'}}/>
                                    <TextField className={"Profile-page-firstcard-text"} id="standard-basic"
                                               label="Department" variant="outlined" required
                                               value={department}
                                               onChange={(e) => setDepartment(e.target.value)}
                                               sx={{width: '15vw'}}/>
                                    <DatePicker label="Birthday" slotProps={{textField: {required: true}}}
                                                value={birthday}
                                                onChange={(e) => setBirthday(dayjs(e))}
                                    sx={{width: '15vw'}}/>
                                </div>
                                <div className={"Profile-page-edit-button"}>
                                    <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84"}}
                                            onClick={updateInfo}>
                                        Update Info
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <div className={"Profile-page-ThreeRows"}>
                            <div className={"ThreeColumnsFirstRow"}>
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
                                            <p className={"Profile-page-top-infonumbers"}>{getAssigned()}</p>
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
                                            <p className={"Profile-page-top-infotext"}>Requests In Progress</p>
                                        </div>
                                        <div className="Number">
                                            <p className={"Profile-page-top-infonumbers"}>{getInProgress()}</p>
                                        </div>
                                    </div>
                                </div>
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
                                            <p className={"Profile-page-top-infonumbers"}>{getCompleted()}</p>
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
                                        <PieChartStats srlist={employee!.requestsAssigned} title={"My Requests"}/>
                                    </div>
                                    <div className={"SecondRow_SecondColumn-TestCard"}>
                                        <p style={{fontSize: 25, fontWeight: 600, fontFamily: 'Lato', marginLeft: '1vw', marginBottom: '-2vh', marginTop: '1vh'}}>Action Buttons</p>
                                        <div style={{display: 'flex', flexDirection: 'column', marginTop:'8.5%', maxWidth: '100%', justifySelf: 'center', alignItems: 'center', alignContent: 'center', rowGap:'20px', alignSelf: 'center'}}>
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84", justifySelf: "center"}}
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
                                        <Button variant="contained" color="primary" style={{backgroundColor: "#34AD84", }}
                                                onClick={() => logout({
                                                    logoutParams: {
                                                        returnTo: window.location.origin
                                                    }
                                                })}>
                                            Log Out
                                        </Button>
                                    </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
