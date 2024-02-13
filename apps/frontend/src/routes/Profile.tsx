import React, {useState} from "react";
import "../css/serviceform_page.css";
import {useAuth0} from "@auth0/auth0-react";
import {CreateEmployee} from "common/src/employeeTypes.ts";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import AuthenticationButton from "../components/AuthenticationButton.tsx";

export default function UpdateNameForm() { ///copied
    const {user, isAuthenticated} = useAuth0();
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    export default function Profile() {
        const navigate = useNavigate();

        // trying to pre-populate form with data from db, but I'm doing something wrong
        /*axios.get("/api/employee", {
            params: { email: user.email }
        }).then(function (response) {
            console.log(response);
            setFirstName(response.firstName);
            setLastName(response.lastName);
        }).catch(function (error) {
            console.log(error);
        });*/

        async function submit() { ///copied
            const employeeInfo: CreateEmployee = {
                email: user!.email!,
                firstName: firstName,
                lastName: lastName
            };
            const res = await axios.post("/api/employee", employeeInfo, {
                headers: {
                    "Content-Type": "application/json"
                }
            });
            if (res.status == 200) {
                console.log("Successfully submitted form");
            }
        }

        return (
            isAuthenticated && (
                <div className="home-container">
                    <div className="nav-container">
                        <Navbar/>
                    </div>

                    <div className="service-form-container">
                        <div className="container">
                            <h2>Edit User Profile</h2>
                            <div className="input-field">
                                <TextField id="standard-basic" label="Email" variant="standard"
                                           value={user.email}
                                           required disabled
                                />
                            </div>

                            <div className="input-field">
                                <TextField id="standard-basic" label="First name" variant="standard"
                                           value={firstName}
                                           onChange={(e) => {
                                               setFirstName(e.target.value);
                                           }}
                                           required
                                />
                            </div>

                            <div className="input-field">
                                <TextField id="standard-basic" label="Last name" variant="standard"
                                           value={lastName}
                                           onChange={(e) => {
                                               setLastName(e.target.value);
                                           }}
                                           required
                                />
                            </div>
                            <br/>
                            <div className="button3">
                                <AuthenticationButton/>
                            </div>
                            <br/>
                            <div>
                                <Button
                                    style={{
                                        backgroundColor: "#012D5A",
                                    }}
                                    variant="contained" onClick={submit}
                                >
                                    Submit
                                </Button>
                            </div>

                        </div>
                    </div>
                </div>
            )
        );
    }
