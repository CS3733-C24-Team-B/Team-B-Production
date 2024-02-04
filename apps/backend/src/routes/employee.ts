import express, { Router, Request, Response } from "express";
import { Employee } from "database";
import client from "../bin/database-connection.ts";

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

export default router;
