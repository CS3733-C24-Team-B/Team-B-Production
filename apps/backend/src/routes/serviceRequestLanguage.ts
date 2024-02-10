import express, {Router, Request, Response} from "express";
import {LanguageRequest} from "common/src/serviceRequestTypes.ts";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {
    const request: LanguageRequest = req.body;
    try {
        await client.languageRequest.create({
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
                language1: request.language1,
                language2: request.language2,
                when: request.when
            }
        });
        return res.status(200).send("Successfully added language service request to db");
    }
    catch (error) {
        console.log(error);
        return res.status(400).send("Could not add language service request to db");
    }
});

export default router;
