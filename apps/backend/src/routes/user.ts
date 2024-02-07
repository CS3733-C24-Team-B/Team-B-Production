import client from "../bin/database-connection.ts";
import express, {Router, Request, Response} from "express";
import {CreateEmployee} from "common/src/employee.ts";

const router: Router = express.Router();

router.get("/:email", async function (req: Request, res: Response) {

    const employeeID: string = req.params.email;

    const employee = await client.employee.findUnique({
        where: {
            email: employeeID
        }
    });
    if (employee === null) {
        return res.status(204).send("Could not find employee with email " + employeeID);
    }
    return res.status(200).send(JSON.stringify(employee));
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

export default router;
