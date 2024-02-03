import express, {Router, Request, Response} from "express";
import {ServiceRequest} from "database";
import client from "../bin/database-connection.ts";
import {NewRequest, ServiceID, StatusType} from "common/src/serviceRequestTypes.ts";

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    const serviceData: ServiceRequest[] = await client.serviceRequest.findMany();
    if (serviceData === null) {
        console.error("No edge data found in database");
        return res.status(204).send("Could not find edge data in database");
    }
    else {
        return res.status(200).send(JSON.stringify(serviceData));
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
                assignedTo: "",
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

router.delete('/', async function (req: Request, res: Response) {
    try {
        const serviceID: ServiceID = req.body;
        await client.serviceRequest.delete({
            where: {
                serviceID: serviceID.serviceID
            }
        });
        return res.status(200).send("Successfully deleted service request from database with ID " + serviceID);
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not delete service request from database");
    }
});

export default router;
