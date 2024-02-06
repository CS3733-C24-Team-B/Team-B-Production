import React, {useState} from "react";
import { useAuth0 } from "@auth0/auth0-react";
import { CreateEmployee } from "common/src/employee.ts";
import axios from "axios";

export default function UpdateNameForm() {
    const { user, isAuthenticated} = useAuth0();
    console.log(user);
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");

    async function submit() {
        const employeeInfo: CreateEmployee = {
            email: user.email,
            firstName: firstName,
            lastName: lastName
        };
        const res = await axios.post("/api/employee", employeeInfo, {
            headers: {
                "Content-Type":"application/json"
            }
        });
        if (res.status == 200) {
            console.log("Successfully submitted form");
        }
    }

    return (
        isAuthenticated && (
            <div>
                <h1>Edit User Profile</h1>

                <div>
                    <h2>Email</h2>
                    <input value={user.email} type={"text"} readOnly={true}/>
                </div>

                <div>
                    <h2>First Name</h2>
                    <input value={firstName} onChange={(e) => {setFirstName(e.target.value);}} type={"text"}/>
                </div>

                <div>
                    <h2>Last Name</h2>
                    <input value={lastName} onChange={(e) => {setLastName(e.target.value);}} type={"text"}/>
                </div>

                <div>
                    <button onClick={submit}>Submit</button>
                </div>
            </div>
        )
    );
}
