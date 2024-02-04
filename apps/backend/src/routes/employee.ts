import express, {Router, Request, Response} from "express";
import {Employee} from "database";
import client from "../bin/database-connection.ts";
import {employee} from "common/src/employee.ts";
import {request} from "common/src/employee.ts";

const router: Router = express.Router();

router.post('/', async function (req: Request, res: Response){
    const employeeInfo: request = req.body;
    await client.employee.create({
        data: {
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
        //const employeeID: string = req.body.username;
        await client.employee.delete({
            where: {
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

