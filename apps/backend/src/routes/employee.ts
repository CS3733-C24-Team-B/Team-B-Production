import express, { Router, Request, Response } from "express";
import multer from "multer";
import Auth0Utility from "../utilities/Auth0Utility.ts";
import { Employee, Prisma } from "database";
import client from "../bin/database-connection.ts";
import {
  CreateEmployee,
  UpdateEmployee,
  DeleteEmployee,
} from "common/src/employeeTypes.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });
const auth0Utility: Auth0Utility = new Auth0Utility();

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
  "/bulk-insert",
  upload.single("employeeFile"),
  async function (req: Request, res: Response) {
    const employeeFile = req.file;

    if (!employeeFile) {
      console.error("No file was uploaded");
      return res.status(400).send("No file was uploaded");
    }

    const employees: Employee[] = [];
    try {
      const employeeData: string = String(employeeFile.buffer);
      const lines: string[] = employeeData.split(/\r?\n/);
      lines.splice(0, 1); // remove 1st line (column headings)

      // loop through lines and put into JSON format
      for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(",");
        if (data.length != 3) {
          continue;
        }
        employees[i] = {
          email: data[0],
          firstName: data[1],
          lastName: data[2],
        };
      }
      console.log(employees.length + " employees read");
    } catch (error) {
      console.error(error);
      console.error("Unable to read employee CSV file");
      return res.status(400).send("Unable to read employee CSV file");
    }

    try {
      await client.employee.createMany({
        data: employees,
      });
      console.info(
        "Successfully added " + employees.length + " employees to database",
      );
    } catch (error) {
      console.error(
        "Unable to add " + employees.length + " employees to database",
      );
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code == "P2002"
      ) {
        console.error(
          "This data already exists in the database, please upload new data",
        );
      } else {
        console.error(error);
      }
      return res.status(400).send("Unable to add employees to the database");
    }

    for (let i: number = 0; i < employees.length; i++) {
      const email: string = employees[i].email;
      try {
        await auth0Utility.createUser(email);
        await auth0Utility.inviteUser(email);

        console.log("Sent invite email to employee with email " + email);
      } catch (error) {
        console.log(error);
        return res
          .status(400)
          .send("Could not send invite email to employee with email " + email);
      }
    }
    return res.status(200).send("Successfully added employees");
  },
);

router.put("/", async function (req: Request, res: Response) {
  const employeeInfo: UpdateEmployee = req.body;
  try {
    await client.employee.upsert({
      where: {
        email: employeeInfo.email,
      },
      update: {
        firstName: employeeInfo.firstName,
        lastName: employeeInfo.lastName,
      },
      create: {
        email: employeeInfo.email,
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

router.delete("/", async function (req: Request, res: Response) {
  try {
    const employeeDelete: DeleteEmployee = req.body;
    await client.employee.delete({
      where: {
        email: employeeDelete.email,
      },
    });

    await auth0Utility.deleteUser(employ
