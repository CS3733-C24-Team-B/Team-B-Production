import React, {useEffect, useState} from "react";
import {useAuth0} from "@auth0/auth0-react";
import axios from "axios";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import DeleteIcon from "@mui/icons-material/Delete";
import {
    Alert,
    Box,
    CircularProgress,
    Dialog,
    DialogActions,
    DialogTitle,
    Paper, Snackbar, Table, TableBody,
    TableCell, TableContainer,
    TableHead,
    TableRow
} from "@mui/material";
import {createTheme, ThemeProvider} from "@mui/material/styles";
import "../../css/servicelist_page.css";
import "../../css/admin_page.css";
import {UpdateEmployee} from "common/src/employeeTypes.ts";
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import IconButton from "@mui/material/IconButton";
import {DatePicker} from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import {MuiTelInput} from "mui-tel-input";


const latoTheme = createTheme({
    components: {
        // Name of the component
        MuiTableCell: {
            styleOverrides: {
                // Name of the slot
                root: {
                    // Some CSS
                    fontFamily: 'Lato',
                },
            },
        },
    },
});

enum employeeSortField { email, firstName, lastName, jobTitle, department, birthday, phoneNumber }

export default function AdminViewer() {

    const {isLoading, getAccessTokenSilently} = useAuth0();
    const [employees, setEmployees] = useState<UpdateEmployee[]>([]);
    const [editRowID, setEditRowID] = useState(-1);
    const [dialogID, setDialogID] = useState(-1);
    const [sortUp, setSortUp] = useState(true);
    const [refresh] = useState(false);
    const [loading, setLoading] = useState(true);
    const [typeSort, setTypeSort] = useState<keyof typeof employeeSortField>();
    const [submitAlert, setSubmitAlert] = useState(false);
    const [isError] = useState(false);
    const [alertText] = useState("");

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
            case employeeSortField.jobTitle:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.jobTitle.localeCompare(b.jobTitle));
                break;
            case employeeSortField.department:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.department.localeCompare(b.department));
                break;
            case employeeSortField.birthday:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => new Date(a.birthday).getTime() - new Date(b.birthday).getTime());
                break;
            case employeeSortField.phoneNumber:
                employeesCopy.sort((a: UpdateEmployee, b: UpdateEmployee) => a.phoneNumber.localeCompare(b.phoneNumber));
                break;
        }
        if (!sortUp) {
            employeesCopy = employeesCopy.reverse();
        }
        setTypeSort(employeeSortField[sortField] as keyof typeof employeeSortField);
        setEmployees(employeesCopy);
    }

    const employeeList = employees.map((employee: UpdateEmployee, index: number) => {

        return (
            <TableRow>
                <TableCell>{employee.email}</TableCell>
                <TableCell> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="First name" variant="standard"
                               sx={{maxWidth: '7vw'}}
                               value={employee.firstName}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].firstName = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>
                ) : (
                    <p>{employee.firstName}</p>
                )}
                </TableCell>
                <TableCell> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="Last name" variant="standard"
                               sx={{maxWidth: '7vw'}}
                               value={employee.lastName}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].lastName = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>

                ) : (
                    <p>{employee.lastName}</p>
                )}
                </TableCell>
                <TableCell> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="Job Title" variant="standard"
                               sx={{maxWidth: '10vw'}}
                               value={employee.jobTitle}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].jobTitle = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>

                ) : (
                    <p>{employee.jobTitle}</p>
                )}
                </TableCell>
                <TableCell> {(editRowID === index) ? (
                    <TextField id="standard-basic" label="Department" variant="standard"
                               sx={{maxWidth: '7vw'}}
                               value={employee.department}
                               onChange={(e) => {
                                   const updatedEmployees: UpdateEmployee[] = [...employees];
                                   updatedEmployees[index].department = e.target.value;
                                   setEmployees(updatedEmployees);
                               }}/>

                ) : (
                    <p>{employee.department}</p>
                )}
                </TableCell>
                <TableCell> {(editRowID === index) ? (
                    <DatePicker label="Birthday" slotProps={{textField: {required: true}}}
                                sx={{maxWidth: '12vw'}}
                                value={dayjs(employee.birthday)} onChange={(e) => {
                        const updatedEmployees: UpdateEmployee[] = [...employees];
                        updatedEmployees[index].birthday = e!.toDate();
                        setEmployees(updatedEmployees);
                    }}/>
                ) : (
                    <p>{employee.birthday ? new Date(employee.birthday).toLocaleDateString() : ""}</p>
                )}</TableCell>
                <TableCell> {(editRowID === index) ? (
                    <MuiTelInput label="Phone Number" defaultCountry="US" forceCallingCode disableDropdown
                                 value={employee.phoneNumber} onChange={(e) => {
                        const updatedEmployees: UpdateEmployee[] = [...employees];
                        updatedEmployees[index].phoneNumber = e;
                        setEmployees(updatedEmployees);
                    }}/>
                ) : (
                    <p>{employee.phoneNumber}</p>
                )}</TableCell>
                <TableCell> {(editRowID === index) ? (
                    <Button variant="outlined" style={{
                        color: "#012D5A"
                    }} onClick={() => {
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

                </TableCell>

                <TableCell>
                    <Button variant="outlined"
                            style={{color: (employee.email === "softengc24b@gmail.com") ? "grey" : "#012D5A"}}
                            disabled={(employee.email === "softengc24b@gmail.com")}
                            onClick={() => {
                                setDialogID(index);
                            }}>
                        <DeleteIcon/>
                    </Button>
                </TableCell>
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
            </TableRow>
        );
    });

    return (
        <div className={"AD-TwoColumns2"}>
            <div className={"AD-TestCard2"} style={{overflowX: 'auto'}}>
                <Box sx={{paddingTop: "2vh"}}>
                    {loading || isLoading ? <CircularProgress className="center-text"/> :
                        <ThemeProvider theme={latoTheme}>
                            <TableContainer component={Paper} className="service-tables"
                                            sx={{maxHeight: "75vh", minWidth: (editRowID === -1) ? '100%' : '150%'}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{maxWidth: '7vw'}}>
                                                Email
                                                <IconButton style={{color: (typeSort === "email" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.email);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{maxWidth: '7vw'}}>
                                                First Name
                                                <IconButton style={{color: (typeSort === "firstName" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.firstName);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{maxWidth: '7vw'}}>
                                                Last Name
                                                <IconButton style={{color: (typeSort === "lastName" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.lastName);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{maxWidth: '10vw'}}>
                                                Job Title
                                                <IconButton style={{color: (typeSort === "jobTitle" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.jobTitle);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{maxWidth: '7vw'}}>
                                                Department
                                                <IconButton style={{color: (typeSort === "department" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.department);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{maxWidth: '12vw'}}>
                                                Birthday
                                                <IconButton style={{color: (typeSort === "birthday" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.birthday);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell sx={{minWidth: '15%'}}>
                                                Phone Number
                                                <IconButton style={{color: (typeSort === "phoneNumber" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.phoneNumber);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell/>
                                            <TableCell/>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {employeeList}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </ThemeProvider>}
                </Box>
            </div>
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
    );
}
