import express, {Router, Request, Response} from "express";
import multer from "multer";
// import Auth0Utility from "../utilities/Auth0Utility.ts";
import {EmployeeCSVUtility} from "../utilities/CSVUtility.ts";
import {Employee} from "database";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({storage: multer.memoryStorage()});
// const auth0Utility: Auth0Utility = new Auth0Utility();
const csvUtility: EmployeeCSVUtility = new EmployeeCSVUtility();

router.get("/download", async function (req: Request, res: Response) {
    const csvString: string = await csvUtility.download();
    return res.status(200).send(csvString);
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
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add employees");
    }
});

router.get("/download-template", function (req: Request, res: Response) {
    const csvString: string = csvUtility.downloadTemplate();
    return res.status(200).send(csvString);
});

router.delete("/", async function (req: Request, res: Response) {

    const email: string = req.params.email;
    console.log(email);

    try {
        const employees: Employee[] = await client.employee.findMany();
        await client.employee.deleteMany();
        for (let i: number = 0; i < employees.length; i++) {
            // await auth0Utility.deleteUser(employees[i].email);
        }
        return res.status(200).send("Deleted all employees");

    } catch (error) {
        console.error(error);
        return res.status(400);
    }
});

export default router;
