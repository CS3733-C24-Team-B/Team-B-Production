import express, { Router, Request, Response } from "express";
import multer from "multer";
import Auth0Utility from "../utilities/Auth0Utility.ts";
import { Employee } from "database";
import client from "../bin/database-connection.ts";
import { CreateEmployee, UpdateEmployee } from "common/src/employeeTypes.ts";
import { EmployeeCSVUtility } from "../utilities/CSVUtility.ts";
import * as fs from "fs";
const router: Router = express.Router();
const auth0Utility: Auth0Utility = new Auth0Utility();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });
const uploadProfilePicture: multer.Multer = multer({
  dest: "profile-pictures/",
  limits: { fileSize: 3000000 },
});
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
        email: email,
      },
      include: {
        requestsCreated: true,
        requestsAssigned: true,
      },
    });
    if (employee === null) {
      console.error(
        "Could not find employee with email " + email + " in the database",
      );
      return res
        .status(204)
        .send(
          "Could not find employee with email " + email + " in the database",
        );
    }
    return res.status(200).send(JSON.stringify(employee));
  }
});

router.get(
  "/reset-password/:email",
  async function (req: Request, res: Response) {
    const email: string = req.params.email;
    const resetPasswordLink: string = await auth0Utility.resetPassword(email);
    return res.status(200).send(resetPasswordLink);
  },
);

router.post("/", async function (req: Request, res: Response) {
  const employeeInfo: CreateEmployee = req.body;
  try {
    await client.employee.create({
      data: {
        email: employeeInfo.email,
        firstName: employeeInfo.firstName,
        lastName: employeeInfo.lastName,
      },
    });

    await auth0Utility.createUser(employeeInfo.email);
    await auth0Utility.inviteUser(employeeInfo.email);

    res.status(200).send("Created employee with email " + employeeInfo.email);
  } catch (error) {
    console.log(error);
    res
      .status(400)
      .send("Could not create employee with email " + employeeInfo.email);
  }
});

router.post(
  "/profile-picture/:email",
  uploadProfilePicture.single("newProfilePicture"),
  async function (req: Request, res: Response) {
    console.log(req.file!.mimetype);
    const email: string = req.params.email;
    const file: Express.Multer.File | undefined = req.file;

    if (!file) {
      console.error("No file was uploaded");
      return res.status(400).send("No file was uploaded");
    }

    const imageName: string = file.filename;
    await client.employee.update({
      where: {
        email: email,
      },
      data: {
        profilePicture: imageName,
      },
    });

    res.status(200).send("Profile picture saved successfully");
  },
);

router.get(
  "/profile-picture/:email",
  async function (req: Request, res: Response) {
    const email: string = req.params.email;
    const employee: Employee | null = await client.employee.findUnique({
      where: {
        email: email,
      },
    });
    if (employee === null) {
      console.error(
        "Could not find employee with email " + email + " in the database",
      );
      return res
        .status(204)
        .send(
          "Could not find employee with email " + email + " in the database",
        );
    }

    const imageName: string | null = employee.profilePicture;
    if (imageName === null) {
      return res.status(204).send("Employee does not have a profile picture");
    }

    const buffer: string = fs
      .readFileSync("./profile-pictures/" + imageName)
      .toString("base64");
    return res.status(200).send(buffer);
  },
);

router.put("/", async function (req: Request, res: Response) {
  const employeeInfo: UpdateEmployee = req.body;
  try {
    await client.employee.update({
      where: {
        email: employeeInfo.email,
      },
      data: {
        firstName: employeeInfo.firstName,
        lastName: employeeInfo.lastName,
      },
    });
    res
      .status(200)
      .send(
        "Updated name of " +
          employeeInfo.email +
          " to " +
          employeeInfo.firstName +
          " " +
          employeeInfo.lastName,
      );
  } catch (error) {
    console.log(error);
    res.status(400).send("Could not update name of " + employeeInfo.email);
  }
});

router.delete("/:email", async function (req: Request, res: Response) {
  const email: string = req.params.email;

  try {
    await client.employee.delete({
      where: {
        email: email,
      },
    });

    await auth0Utility.deleteUser(email);

    return res.status(200).send("Deleted employee with email " + email);
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
});

router.get("/download", async function (req: Request, res: Response) {
  const csvString: string = await csvUtility.download();
  return res.status(200).send(csvString);
});

router.post(
  "/upload",
  upload.single("employeeFile"),
  async function (req: Request, res: Response) {
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
  },
);

router.get("/download-template", function (req: Request, res: Response) {
  const csvString: string = csvUtility.downloadTemplate();
  return res.status(200).send(csvString);
});

router.delete("/", async function (req: Request, res: Response) {
  try {
    const employees: Employee[] = await client.employee.findMany();
    await client.employee.deleteMany();
    for (let i: number = 0; i < employees.length; i++) {
      await auth0Utility.deleteUser(employees[i].email);
    }
    return res.status(200).send("Deleted all employees");
  } catch (error) {
    console.error(error);
    return res.status(400);
  }
});

export default router;
