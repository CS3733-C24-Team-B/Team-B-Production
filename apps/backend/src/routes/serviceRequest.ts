import express, {Router, Request, Response} from "express";
import {ServiceRequest} from "database";
import client from "../bin/database-connection.ts";
import {request} from "common/src/requestType.ts";

const router: Router = express.Router();

router.get('/', async function (req: Request, res: Response) {
    const serviceData: ServiceRequest[] = await client.serviceRequest.findMany();
    if (serviceData === null) {
        console.error("No edge data found in database");
        return res.sendStatus(204);
    }
    else {
        console.info("Successfully sent " + serviceData.length + "service requests to frontend");
        return res.send(JSON.stringify(serviceData));
    }
});

router.post('/', async function (req: Request, res: Response){
    const serviceInfo:request = req.body;
    await client.serviceRequest.create({
        data: {
            name: serviceInfo.name,
            roomNumber: serviceInfo.roomNumber,
            infoText: serviceInfo.infoText,
            requester: "admin",
            receiver: "admin",
            status: "received"
        }
    });

    console.log(serviceInfo);
    res.status(200).json({
        message: "added service request to db",
    });
});

router.delete('/', async function (req: Request, res: Response) {
    try {
        const serviceID: number = req.body.serviceID;
        await client.serviceRequest.delete({
            where: {
                serviceID: serviceID
            }
        });
        return res.status(200).json({
            message: "deleted service request with ID " + serviceID
        });
    }
    catch (error) {
        console.error(error);
        return res.status(400);
    }
});

export default router;
