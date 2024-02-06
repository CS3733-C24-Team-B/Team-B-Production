import express, {Router, Request, Response} from "express";
import {Employee} from "database";
import client from "../bin/database-connection.ts";
import {CreateEmployee, EmployeeID, DeleteEmployee} from "common/src/employee.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    const employeeID: EmployeeID = req.body;

    // query for single employee
    if (employeeID.email) {
        const employee = await client.employee.findUnique({
            where: {
                email: employeeID.email
            }
        });
        if (employee === null) {
            return res.status(204).send("Could not find employee with email " + employeeID.email);
        }
        return res.status(200).send(JSON.stringify(employee));
    }

    // if no employee is specified, return all employee info
    else {
        const employees: Employee[] = await client.employee.findMany();
        if (employees === null) {
            console.error("No employees found in database");
            return res.status(204).send("No employees found in database");
        } else {
            return res.status(200).send(JSON.stringify(employees));
        }
    }
});

router.post('/', async function (req: Request, res: Response){
    const employeeInfo: CreateEmployee = req.body;
    try {
        await client.employee.upsert({
            where: {
                email: employeeInfo.email
            },
            update: {
                firstName: employeeInfo.firstName,
                lastName: employeeInfo.lastName
            },
            create: {
                email: employeeInfo.email,
                firstName: employeeInfo.firstName,
                lastName: employeeInfo.lastName
            }
        });

        console.log(employeeInfo);
        res.status(200).send("Created/updated employee with email " + employeeInfo.email);
    }
    catch (error) {
        console.log(error);
        res.status(400).send("Could not create/update employee with email " + employeeInfo.email);
    }
});

router.delete('/', async function (req: Request, res: Response) {
    try {
        const employeeDelete: DeleteEmployee = req.body;
        await client.employee.delete({
            where: {
                email: employeeDelete.email
            }
        });
        return res.status(200).json({
            message: "deleted employee"
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400);
    }
});

export default router;
