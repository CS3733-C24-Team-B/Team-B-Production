import express, {Router, Request, Response} from "express";
import multer from "multer";
import Auth0Utility from "../utilities/Auth0Utility.ts";
import {EmployeeCSVUtility} from "../utilities/CSVUtility.ts";
import {Employee} from "database";
import client from "../bin/database-connection.ts";
import {CreateEmployee, UpdateEmployee, DeleteEmployee} from "common/src/employeeTypes.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });
const auth0Utility: Auth0Utility = new Auth0Utility();
const csvUtility: EmployeeCSVUtility = new EmployeeCSVUtility();

router.get("/:email?", async function (req: Request, res: Response) {

    const email: string = req.params.email;

    if (email === undefined) {
        const employees: Employee[] = await client.employee.findMany();
        if (employees === null) {
            console.error("No employees found in database");
            return res.status(204).send("No employees found in database");
        }
        return res.status(200).send(JSON.stringify(employees));
    } else {
        const employee: Employee | null = await client.employee.findUnique({
            where: {
                email: email
            },
            include: {
                requestsCreated: true,
                requestsAssigned: true
            }
        });
        if (employee === null) {
            console.error("Could not find employee with email " + email + " in the database");
            return res.status(204).send("Could not find employee with email " + email + " in the database");
        }
        return res.status(200).send(JSON.stringify(employee));
    }
});

router.get("/reset-password/:email", async function (req: Request, res: Response) {
    const email: string = req.params.email;
    const resetPasswordLink: string = await auth0Utility.resetPassword(email);
    return res.status(200).send(resetPasswordLink);
});

router.post("/", async function (req: Request, res: Response) {
    const employeeInfo: CreateEmployee = req.body;
    try {
        await client.employee.create({
            data: {
                email: employeeInfo.email,
                firstName: employeeInfo.firstName,
                lastName: employeeInfo.lastName
            }
        });

        await auth0Utility.createUser(employeeInfo.email);
        await auth0Utility.inviteUser(employeeInfo.email);

        res.status(200).send("Created employee with email " + employeeInfo.email);
    } catch (error) {
        console.log(error);
        res.status(400).send("Could not create employee with email " + employeeInfo.email);
    }
});

router.get("/download", async function (req: Request, res: Response) {
    const blob: Blob = await csvUtility.download();
    return res.status(200).send(blob);
});

router.post("/upload", upload.single("employeeFile"), async function (req: Request, res: Response) {
    const employeeFile: Express.Multer.File | undefined = req.file;

    if (!employeeFile) {
        console.error("No file was uploaded");
        return res.status(400).send("No file was uploaded");
    }

    try {
        await csvUtility.upload(employeeFile);
        return res.status(200).send("Successfully added employees");
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not add employees");
    }
});

router.get("/download-template", function (req: Request, res: Response) {
    const blob: Blob = csvUtility.downloadTemplate();
    return res.status(200).send(blob);
});

router.put("/", async function (req: Request, res: Response) {
    const employeeInfo: UpdateEmployee = req.body;
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
        res.status(200).send("Updated name of " + employeeInfo.email + " to " +
            employeeInfo.firstName + " " + employeeInfo.lastName);
    } catch (error) {
        console.log(error);
        res.status(400).send("Could not update name of " + employeeInfo.email);
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

        await auth0Utility.deleteUser(employeeDelete.email);

        return res.status(200).json({
            message: "deleted employee"
        });
    } catch (error) {
        console.error(error);
        return res.status(400);
    }
});

export default router;
