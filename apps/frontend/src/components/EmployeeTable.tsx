import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import IosShareIcon from '@mui/icons-material/IosShare';
import SimCardDownloadIcon from '@mui/icons-material/SimCardDownload';
import DeleteIcon from "@mui/icons-material/Delete";
import {CircularProgress, Dialog, DialogActions, DialogTitle} from "@mui/material";
import {styled} from "@mui/material/styles";
import "../css/servicelist_page.css";
import "../css/admin_page.css";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import SwapVertIcon from "@mui/icons-material/SwapVert";


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

enum employeeSortField { email, firstName, lastName }

export default function AdminViewer() {

    const {isLoading, getAccessTokenSilently} = useAuth0();
    const [employees, setEmployees] = useState<UpdateEmployee[]>([]);
    const [editRowID, setEditRowID] = useState(-1);
    const [dialogID, setDialogID] = useState(-1);
    const [sortUp, setSortUp] = useState(true);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(true);

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
        })().then(() => {
            setLoading(false);
        });
    }, [getAccessTokenSilently, refresh]);

    function sortEmployees(sortField: employeeSortField) {
        let employeesCopy: UpdateEmployee[] = [...employees];
        switch (sortField) {
            case employeeSortField.email:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.email.localeCompare(b.email));
                break;
            case employeeSortField.firstName:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.firstName.localeCompare(b.firstName));
                break;
            case employeeSortField.lastName:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.lastName.localeCompare(b.lastName));
                break;
        }
        if (!sortUp) {
            employeesCopy = employeesCopy.reverse();
        }
        setEmployees(employeesCopy);
    }

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
            setLoading(true);
            getAccessTokenSilently().then((accessToken: string) => {
                axios.post("/api/admin-employee/upload", form, {
                    headers: {
                        Authorization: "Bearer " + accessToken,
                        "Content-Type": "multipart/form-data"
                    }
                }).then(() => {
                    setRefresh(!refresh);
                });
            });
        } catch (error) {
            console.error(error);
        }
    }

    async function downloadFile() {
        console.log("Downloading employee info from database");

        try {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/admin-employee/download", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob: Blob = new Blob([res.data], {type: "text/csv"});
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

    async function downloadTemplate() {
        console.log("Downloading employee CSV template");
        try {
            const accessToken: string = await getAccessTokenSilently();
            const res = await axios.get("/api/admin-employee/download-template", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            });
            const blob: Blob = new Blob([res.data], {type: "text/csv"});
            const a = document.createElement("a");
            a.download = "EmployeeDataTemplate.csv";
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

    async function deleteTable() {
        console.log("Deleting all employees");
        try {
            const accessToken: string = await getAccessTokenSilently();
            axios.delete("/api/admin-employee", {
                headers: {
                    Authorization: "Bearer " + accessToken
                }
            }).then(() => {
                setRefresh(!refresh);
            });
        } catch (error) {
            console.error(error);
        }
    }

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
                    <Button variant="outlined" style={{
                        color: "#012D5A"}} onClick={() => {
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
                                    axios.delete("/api/employee/" + employee.email, {
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

    return (
            <div className={"AD-TwoColumns2"}>
                <div className={"AD-TestCard2"}>
                    <br/>
                    {loading || isLoading ? <CircularProgress/> :<table className={"employee-tables"}>
                        <thead>
                        <tr>
                            <th>
                                Email
                                <button onClick={() => {
                                    setSortUp(!sortUp);
                                    sortEmployees(employeeSortField.email);
                                }}><SwapVertIcon/></button>
                            </th>
                            <th>
                                First Name
                                <button onClick={() => {
                                    setSortUp(!sortUp);
                                    sortEmployees(employeeSortField.firstName);
                                }}><SwapVertIcon/></button>
                            </th>
                            <th>
                                Last Name
                                <button onClick={() => {
                                    setSortUp(!sortUp);
                                    sortEmployees(employeeSortField.lastName);
                                }}><SwapVertIcon/></button>
                            </th>
                            <th></th>
                            <th></th>
                        </tr>
                        </thead>
                        <tbody>
                        {employeeList}
                        </tbody>
                    </table>}
                </div>
                <div className={"AD-TwoRows2"}>
                    <div className={"AD-Card3"}>
                        <p className={"AD-head"}>Actions</p>
                        <Button component="label" variant="contained" startIcon={<CloudUploadIcon/>}
                                style={{
                                    backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                    marginLeft: "5%",
                                    minWidth: "90%",
                                    fontFamily: 'Lato',
                                    fontSize: '90%',
                                    textTransform: 'none',
                                }}>
                            Upload File
                            <VisuallyHiddenInput id="employeeFile" type="file" onChange={uploadFile}/>
                        </Button>
                        <Button component="label" variant="contained" startIcon={<IosShareIcon/>}
                                onClick={downloadFile}
                                className="export-button"
                                style={{
                                    backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                    minWidth: "90%",
                                    fontFamily: 'Lato',
                                    fontSize: '90%',
                                    textTransform: 'none'
                                }}>
                            Export File
                        </Button>
                        <Button component="label" variant="contained" startIcon={<SimCardDownloadIcon/>}
                                onClick={downloadTemplate}
                                className="export-button"
                                style={{
                                    backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                    minWidth: "90%",
                                    fontFamily: 'Lato',
                                    fontSize: '90%',
                                    textTransform: 'none'
                                }}>
                            Template
                        </Button>
                        <Button component="label" variant="contained" startIcon={<DeleteIcon/>}
                                onClick={deleteTable}
                                className="export-button"
                                style={{
                                    backgroundColor: "#34AD84", margin: "8%", maxHeight: "60%",
                                    minWidth: "90%",
                                    fontFamily: 'Lato',
                                    fontSize: '90%',
                                    textTransform: 'none'
                                }}>
                            Delete Data
                        </Button>
                    </div>
                    <div className={"AD-OneCard2"}>
                        <p className={"AD-head2"}>Last Updated:</p>
                        <br/>
                        <br/>
                        <p className={"AD-head2"}>12:02pm, 2/20/2024</p>
                        {/*<p className={"AD-head3"}>21:02</p>*/}
                        {/*<p className={"AD-head4"}>May 23, 2023</p>*/}
                    </div>
                </div>
            </div>
    );
}
