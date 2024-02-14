import React, {useEffect, useState} from "react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import "../css/servicelist_page.css";
import "../css/admin_page.css";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import {Alert, Snackbar} from "@mui/material";

export default function EmployeeManager() {

    const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
    const [employees, setEmployees] = useState<UpdateEmployee[]>([]);
    const [editRowID, setEditRowID] = useState(-1);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertText, setAlertText] = useState("");
    const [doRefresh, setRefresh] = useState(false);

    function validEmail(em:string) {
        const aInd = em.indexOf("@");
        const dotInd = em.indexOf(".");
        return aInd > 0 && dotInd > 0 && dotInd > aInd;
    }

    async function refresh() {
        axios.get("/api/employee").then((res) => {
            console.log(res.data);
            setEmployees(res.data);
        });
    }

    useEffect(() => {
        refresh().then();
    }, []);

    const addEmployeeEmail = (
        <TextField inputMode="email"
                   type="email"
            id="standard-basic" label="New employee email" variant="standard"
                   value={newEmployeeEmail}
                   onChange={(e) => {
                       setNewEmployeeEmail(e.target.value);
                   }}
        />
    );

    const addEmployeeButton = (
        <Button variant="contained" color="primary" style={{backgroundColor: "#012D5A"}} onClick={() => {
            const alreadyExists = employees.find(({email}) => {
                return email === newEmployeeEmail;
            });
            if (alreadyExists === undefined && validEmail(newEmployeeEmail)) {
                setIsError(false);
                setAlertText("Email has been sent.");
                axios.post("/api/employee", {
                    email: newEmployeeEmail
                }, {
                    headers: {
                        "Content-Type": "application/json"
                    }
                }).then();
                refresh().then();
                setRefresh(!doRefresh);
            } else {
                setIsError(true);
                setAlertText("Error sending email.");
            }
            setSubmitAlert(true);
        }}>
            Invite
        </Button>);

    const employeeList = employees.map((employee: UpdateEmployee, index: number) => {
        return (
            <tr>
                <td>{employee.email}</td>
                <td> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="First name" variant="standard"
                               value={employee.firstName}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].firstName = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>
                ) : (
                    <p>{employee.firstName}</p>
                )}
                </td>
                <td> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="Last name" variant="standard"
                               value={employee.lastName}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].lastName = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>

                ) : (
                    <p>{employee.lastName}</p>
                )}
                </td>

                <td> {(editRowID === index) ? (
                    <Button variant="outlined" style={{color: "#012D5A"}} onClick={() => {
                        console.log("Editing employee with email " + employee.email);
                        console.log(employee);
                        axios.put("/api/employee", employee, {
                            headers: {
                                "Content-Type": "application/json"
                            }
                        }).then();
                        setEditRowID(-1);
                    }}>
                        <CheckIcon/>
                    </Button>
                ) : (
                    <Button variant="outlined" style={{color: "#012D5A"}} onClick={() => {
                        setEditRowID(index);
                    }}>
                        <EditIcon/>
                    </Button>
                )}

                </td>

                <td>
                    <Button variant="outlined" style={{color: "#012D5A"}} onClick={() => {
                        console.log("Deleting employee with email " + employee.email);
                        axios.delete("/api/employee", {
                            data: {
                                email: employee.email
                            }
                        }).then();
                        refresh().then();
                    }}>
                        <DeleteIcon/>
                    </Button>
                </td>
            </tr>
        );
    });

    return (
        <div className="request-container">
            <div className="req-list-header">
                <header className={'headerblue'}>Employees</header>
            </div>
            <br/>
            <div className="invite-buttons">
                <div className="invite-text">{addEmployeeEmail} {addEmployeeButton}</div>
            </div>
            <br/>
            <table className={"employee-tables"}>
                <thead>
                <tr>
                    <th>Email</th>
                    <th>First Name</th>
                    <th>Last Name</th>
                    <th></th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                {employeeList}
                </tbody>
            </table>

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                open={submitAlert}
                autoHideDuration={3500}
                onClose={() => {
                    setSubmitAlert(false);
                }}>
                <Alert
                    severity={isError ? "error" : "success"}
                    sx={{ width: '100%' }}
                >
                    {alertText}
                </Alert>
            </Snackbar>
        </div>
    );
}

