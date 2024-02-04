import express, {Router, Request, Response} from "express";
import {Employee} from "database";
import client from "../bin/database-connection.ts";
import {employee, employeeDelete} from "common/src/employee.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {
    const employees: Employee[] = await client.employee.findMany();
    if (employees === null) {
        console.error("No employees found in database");
        return res.status(204).send("No employees found in database");
    }
    else {
        return res.status(200).send(JSON.stringify(employees));
    }
});

router.post('/', async function (req: Request, res: Response){
    const employeeInfo: employee = req.body;
    await client.employee.create({
        data: {
            email: employeeInfo.email,
            username: employeeInfo.username,
            password: employeeInfo.password
        }
    });

    console.log(employeeInfo);
    res.status(200).json({
        message: "added employee to db",
    });
});

router.delete('/', async function (req: Request, res: Response) {
    try {
        const employeeDelete: employeeDelete = req.body;
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

