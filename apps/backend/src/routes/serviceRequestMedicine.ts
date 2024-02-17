import express, {Router, Request, Response} from "express";
import {MedicineRequest} from "common/src/serviceRequestTypes.ts";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
    const request: MedicineRequest = req.body;
    try {
        await client.medicineRequest.create({
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
                medicineType: request.medicineType,
                amount: request.amount
            }
        });
        return res.status(200).send("Successfully added medicine service request to db");
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Could not add medicine service request to db");
    }
});

export default router;
