import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {ServiceAssignment} from "common/src/serviceRequestTypes.ts";

const router: Router = express.Router();

router.post('/', async function (req: Request, res: Response){
    const serviceAssignment: ServiceAssignment = req.body;
    try {
        await client.serviceRequest.update({
            where: {
                serviceID: serviceAssignment.serviceID
            },
            data: {
                assignedTo: {
                    connect: {
                        email: serviceAssignment.assignedTo
                    }
                }
            }
        });
        return res.status(200).send("Successfully assigned service request with ID "
            + serviceAssignment.serviceID + " to employee " + serviceAssignment.assignedTo);
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not assign service request with ID " + serviceAssignment.serviceID);
    }
});

export default router;
