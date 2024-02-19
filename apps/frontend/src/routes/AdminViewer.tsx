import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import Navbar from "../components/Navbar.tsx";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CheckIcon from '@mui/icons-material/Check';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import IosShareIcon from '@mui/icons-material/IosShare';
import {CircularProgress, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {Alert, Snackbar} from "@mui/material";
import {styled} from "@mui/material/styles";
import "../css/servicelist_page.css";
import "../css/admin_page.css";
import {UpdateEmployee} from "common/src/employeeTypes.ts";


const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

function validEmail(em: string) {
    const aInd = em.indexOf("@");
    const dotInd = em.indexOf(".");
    return aInd > 0 && dotInd > 0 && dotInd > aInd;
}

export default function AdminViewer() {

    const {user, isAuthenticated, isLoading, getAccessTokenSilently} = useAuth0();
    const isAdmin: boolean = isAuthenticated && user!.email! === "softengc24b@gmail.com";
    const [newEmployeeEmail, setNewEmployeeEmail] = useState("");
    const [employees, setEmployees] = useState<UpdateEmployee[]>([]);
    const [editRowID, setEditRowID] = useState(-1);
    const [dialogID, setDialogID] = useState(-1);
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError, setIsError] = useState(false);
    const [alertText, setAlertText] = useState("");

    // Refresh employee data
    useEffect(() => {
        (async () => {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            setEmployees(res.data);
        })();
    }, [getAccessTokenSilently]);

    function uploadFile() {
        console.log("Uploading employee info to database");
        try {
            const form: FormData = new FormData();
            const employeeFile = document.querySelector('#employeeFile') as HTMLInputElement;
            if (employeeFile == null) {
                console.log("csv file is null");
                return;
            }
            form.append("employeeFile", employeeFile.files![0]);
            getAccessTokenSilently().then((accessToken: string) => {
                axios.post("/api/employee/bulk-insert", form, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "multipart/form-data"
                    }
                }).then();
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function downloadFile() {
        console.log("Downloading employee info from database");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const headers: string[] = ["email, firstName, lastName"];
            const resCSV = res.data.reduce((employees: string[], employeeData: UpdateEmployee) => {
                employees.push([employeeData.email, employeeData.firstName, employeeData.lastName].join(','));
                return employees;
            }, []);
            const data: string = [...headers, ...resCSV].join('\n');
            const blob: Blob = new Blob([data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "EmployeeData.csv";
            a.href = window.URL.createObjectURL(blob);
            const clickEvent: MouseEvent = new MouseEvent("click", {
                view: window,
                bubbles: true,
                cancelable: true
            });
            a.dispatchEvent(clickEvent);
            a.remove();
        } catch (error) {
            console.error(error);
        }
    }

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

                // add employee to database
                getAccessTokenSilently()
                    .then((accessToken: string) => {
                        axios.post("/api/employee", {
                            email: newEmployeeEmail
                        }, {
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: "Bearer " + accessToken
                            }
                        }).then();
                    });

                // add employee to table
                const updatedEmployees: UpdateEmployee[] = [...employees];
                updatedEmployees.push({email: newEmployeeEmail, firstName: "", lastName: ""});
                setEmployees(updatedEmployees);
                setNewEmployeeEmail("");
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
                        getAccessTokenSilently()
                            .then((accessToken: string) => {
                                axios.put("/api/employee", employee, {
                                    headers: {
                                        "Content-Type": "application/json",
                                        Authorization: "Bearer " + accessToken
                                    }
                                }).then();
                            });
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
                    <Button variant="outlined"
                            style={{color: (employee.email === "softengc24b@gmail.com") ? "grey" : "#012D5A"}}
                            disabled={(employee.email === "softengc24b@gmail.com")}
                            onClick={() => {
                                setDialogID(index);
                            }}>
                        <DeleteIcon/>
                    </Button>
                </td>
                <Dialog
                    open={dialogID === index}
                    onClose={() => {
                        setDialogID(-1);
                    }}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"Are you sure you want to delete that account?"}
                    </DialogTitle>
                    <DialogActions>
                        <Button onClick={() => {
                            console.log("Deleting employee with email " + employee.email);
                            getAccessTokenSilently()
                                .then((accessToken: string) => {
                                    axios.delete("/api/employee", {
                                        data: {
                                            email: employee.email
                                        },
                                        headers: {
                                            Authorization: "Bearer " + accessToken
                                        }
                                    }).then();
                                });

                            const updatedEmployees: UpdateEmployee[] = [...employees];
                            updatedEmployees.splice(index, 1);
                            setEmployees(updatedEmployees);
                            setDialogID(-1);
                        }}>Yes</Button>
                        <Button onClick={() => {
                            setDialogID(-1);
                        }} autoFocus>
                            No
                        </Button>
                    </DialogActions>
                </Dialog>
            </tr>
        );
    });

    if (isLoading) {
        return <div className="loading-center"><CircularProgress/></div>;
    }

    if (!isAdmin) {
        return window.location.href = "/";
    }

    return (
        <div className="home-container">
            <div className="nav-container">
                <Navbar/>
            </div>
            <div className="data-container">
                <div className="req-list-header">
                    <header className={'headerblue'}>Employees</header>
                </div>
                <br/>
                <div>
                    <div className="upload-buttons">
                        <Button component="label" variant="contained" startIcon={<UploadFileIcon/>}
                                style={{backgroundColor: "#012D5A"}}>
                            Upload File
                            <VisuallyHiddenInput id="employeeFile" type="file" onChange={uploadFile}/>
                        </Button>
                    </div>
                    <br/>
                    <div className="upload-buttons">
                        <Button component="label" variant="contained" startIcon={<IosShareIcon/>}
                                onClick={downloadFile}
                                className="export-button"
                                style={{backgroundColor: "#012D5A"}}>
                            Export File
                        </Button>
                    </div>
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
                    anchorOrigin={{vertical: "top", horizontal: "center"}}
                    open={submitAlert}
                    autoHideDuration={3500}
                    onClose={() => {
                        setSubmitAlert(false);
                    }}>
                    <Alert
                        severity={isError ? "error" : "success"}
                        sx={{width: '100%'}}
                    >
                        {alertText}
                    </Alert>
                </Snackbar>
            </div>
        </div>
    );
}
