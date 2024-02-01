import express, {Router, Request, Response} from "express";
import {ServiceRequest} from "database";
import client from "../bin/database-connection.ts";

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
    const serviceInfo = req.body;
    console.log(serviceInfo);
    await client.serviceRequest.create({
        data: {
            roomNumber: parseInt(serviceInfo.roomNumber),
            infoText: serviceInfo.infoText
        }
    });

    console.log(serviceInfo);
    res.status(200).json({
        message: "added service request to db",
    });
});
export default router;
