import express, {Router, Request, Response} from "express";
import {ServiceRequest} from "database";
import client from "../bin/database-connection.ts";
import {NewRequest, UpdateRequest, DeleteRequest, StatusType} from "common/src/serviceRequestTypes.ts";

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    const serviceRequest: ServiceRequest[] = await client.serviceRequest.findMany();
    if (serviceRequest === null) {
        console.error("No edge data found in database");
        return res.status(204).send("Could not find edge data in database");
    }
    else {
        return res.status(200).send(JSON.stringify(serviceRequest));
    }
});

router.post('/', async function (req: Request, res: Response){
    const serviceInfo: NewRequest = req.body;
    try {
        await client.serviceRequest.create({
            data: {
                name: serviceInfo.name,
                roomNumber: serviceInfo.roomNumber,
                infoText: serviceInfo.infoText,
                status: StatusType.Unassigned
            }
        });
        console.log(serviceInfo);
        return res.status(200).send("Successfully added service request to database");
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not add service request to database");
    }
});

router.put('/', async function (req: Request, res: Response) {
    const serviceRequest: UpdateRequest = req.body;
    try {
        await client.serviceRequest.update({
            where: {
                serviceID: serviceRequest.serviceID
            },
            data: {
                assignedTo: {
                    connect: {
                        email: serviceRequest.assignedTo,
                    }
                },
                status: serviceRequest.status
            }
        });
        return res.status(200).send("Successfully updated service request with ID " + serviceRequest.serviceID);
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not update service request with ID " + serviceRequest.serviceID);
    }
});

router.delete('/', async function (req: Request, res: Response) {
    try {
        const serviceRequest: DeleteRequest = req.body;
        await client.serviceRequest.delete({
            where: {
                serviceID: serviceRequest.serviceID
            }
        });
        return res.status(200).send("Successfully deleted service request from database with ID " + serviceRequest);
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not delete service request from database");
    }
});

export default router;
