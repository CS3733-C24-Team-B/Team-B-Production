import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {ServiceStatus} from "common/src/serviceRequestTypes.ts";

const router: Router = express.Router();

router.post('/', async function (req: Request, res: Response){
    const serviceStatus: ServiceStatus = req.body;
    try {
        await client.serviceRequest.update({
            where: {
                serviceID: serviceStatus.serviceID
            },
            data: {
                status: serviceStatus.status
            }
        });
        return res.status(200).send("Successfully set status of service request with ID "
            + serviceStatus.serviceID + " to " + serviceStatus.status);
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not set status of service request with ID " + serviceStatus.serviceID);
    }
});

export default router;
