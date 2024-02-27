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

enum employeeSortField { email, firstName, lastName }

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
            <div className={"AD-TestCard2"}>
                <Box sx={{ paddingTop:"2vh"}}>
                    {loading || isLoading ? <CircularProgress className="center-text"/> :
                        <ThemeProvider theme={latoTheme}>
                            <TableContainer component={Paper} className="service-tables"
                                            sx={{maxHeight: "75vh"}}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>
                                                Email
                                                <IconButton style={{color: (typeSort === "email" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.email);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell>
                                                First Name
                                                <IconButton style={{color: (typeSort === "firstName" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.firstName);
                                                            }}>{sortUp ?
                                                    <ArrowUpwardIcon style={{fontSize: '0.65em'}}/> :
                                                    <ArrowDownwardIcon style={{fontSize: '0.65em'}}/>}</IconButton>
                                            </TableCell>
                                            <TableCell>
                                                Last Name
                                                <IconButton style={{color: (typeSort === "lastName" ? "#34AD84" : "")}}
                                                            onClick={() => {
                                                                setSortUp(!sortUp);
                                                                sortEmployees(employeeSortField.lastName);
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
