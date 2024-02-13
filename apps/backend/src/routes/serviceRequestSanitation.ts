import express, {Router, Request, Response} from "express";
import {SanitationRequest} from "common/src/serviceRequestTypes.ts";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
    const request: SanitationRequest = req.body;
    try {
        await client.sanitationRequest.create({
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
                hazards: request.hazards
            }
        });
        return res.status(200).send("Successfully added sanitation service request to db");
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Could not add sanitation service request to db");
    }
});

export default router;
