import express, {Router, Request, Response} from "express";
import {MaintenanceRequest} from "common/src/serviceRequestTypes.ts";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
    const request: MaintenanceRequest = req.body;
    try {
        await client.maintenanceRequest.create({
            data: {
                serviceRequest: {
                    create: {
                        createdBy: {
                            connect: {
                                email: request.createdByID
                            }
                        },
                        locationID: request.locationID,
                        priority: request.priority,
                        status: request.status,
                        assignedTo: {
                            connect: {
                                email: request.assignedID
                            }
                        },
                        notes: request.notes
                    }
                },
                details: request.details
            }
        });
        return res.status(200).send("Successfully added maintenance service request to db");
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Could not add maintenance service request to db");
    }
});

export default router;
