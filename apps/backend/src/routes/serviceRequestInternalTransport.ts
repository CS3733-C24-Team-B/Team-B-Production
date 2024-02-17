import express, {Router, Request, Response} from "express";
import {InternalTransportRequest} from "common/src/serviceRequestTypes.ts";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
    const request: InternalTransportRequest = req.body;
    try {
        await client.internalTransportRequest.create({
            data: {
                serviceRequest: {
                    create: {
                        createdBy: {
                            connect: {
                                email: request.createdByID
                            }
                        },
                        location: {
                            connect: {
                                nodeID: request.locationID
                            }
                        },
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
                toLocation: request.toLocation,
                mobilityAid: request.mobilityAid,
                patientName: request.patientName
            }
        });
        return res.status(200).send("Successfully added internal transportation service request to db");
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Could not add internal transportation service request to db");
    }
});

export default router;
