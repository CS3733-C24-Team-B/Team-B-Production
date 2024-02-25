import express, {Request, Response, Router} from "express";
import {ServiceRequest} from "database";
import {EmailUtility} from "../utilities/EmailUtility.ts";
import client from "../bin/database-connection.ts";
import {
    NewServiceRequest, UpdateRequest, DeleteRequest, SanitationRequest, MaintenanceRequest,
    InternalTransportRequest, LanguageRequest, MedicineRequest
} from "common/src/serviceRequestTypes.ts";

const router: Router = express.Router();
const emailUtility: EmailUtility = new EmailUtility();

router.get('/', async function (req: Request, res: Response) {
    const serviceRequest: ServiceRequest[] = await client.serviceRequest.findMany({
        include: {
            createdBy: true,
            assignedTo: true,
            sanitation: true,
            maintenance: true,
            internalTransport: true,
            medicine: true,
            language: true
        }
    });
    if (serviceRequest === null) {
        console.error("No edge data found in database");
        return res.status(204).send("Could not find edge data in database");
    } else {
        return res.status(200).send(JSON.stringify(serviceRequest));
    }
});

/**
 * Generates the JSON schema for creating a generic service request with Prisma.
 * @param request
 */
function serviceRequestPrismaFields(request: NewServiceRequest) {
    return {
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
    };
}

router.post('/', async function (req: Request, res: Response) {
    const request: NewServiceRequest = req.body;
    try {
        await client.serviceRequest.create({
            data: serviceRequestPrismaFields(request)
        });
        return res.status(200).send("Successfully added general service request to database");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add general service request to database");
    }
});

router.post("/sanitation", async function (req: Request, res: Response) {
    const request: SanitationRequest = req.body;
    try {
        await client.sanitationRequest.create({
            data: {
                serviceRequest: {
                    create: serviceRequestPrismaFields(request)
                },
                hazards: request.hazards
            }
        });
        return res.status(200).send("Successfully added sanitation service request to db");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add sanitation service request to db");
    }
});

router.post("/maintenance", async function (req: Request, res: Response) {
    const request: MaintenanceRequest = req.body;
    try {
        await client.maintenanceRequest.create({
            data: {
                serviceRequest: {
                    create: serviceRequestPrismaFields(request)
                },
                details: request.details
            }
        });
        return res.status(200).send("Successfully added maintenance service request to db");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add maintenance service request to db");
    }
});

router.post("/internal-transport", async function (req: Request, res: Response) {
    const request: InternalTransportRequest = req.body;
    try {
        await client.internalTransportRequest.create({
            data: {
                serviceRequest: {
                    create: serviceRequestPrismaFields(request)
                },
                toLocation: request.toLocation,
                mobilityAid: request.mobilityAid,
                patientName: request.patientName
            }
        });
        return res.status(200).send("Successfully added internal transportation service request to db");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add internal transportation service request to db");
    }
});

router.post("/medicine", async function (req: Request, res: Response) {
    const request: MedicineRequest = req.body;
    try {
        await client.medicineRequest.create({
            data: {
                serviceRequest: {
                    create: serviceRequestPrismaFields(request)
                },
                medicineType: request.medicineType,
                amount: request.amount
            }
        });
        return res.status(200).send("Successfully added medicine service request to db");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add medicine service request to db");
    }
});

router.post("/language", async function (req: Request, res: Response) {
    const request: LanguageRequest = req.body;
    try {
        await client.languageRequest.create({
            data: {
                serviceRequest: {
                    create: serviceRequestPrismaFields(request)
                },
                language1: request.language1,
                language2: request.language2,
                when: request.when
            }
        });
        return res.status(200).send("Successfully added language service request to db");
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not add language service request to db");
    }
});

router.put('/', async function (req: Request, res: Response) {
    const serviceRequest: UpdateRequest = req.body;
    let previousAssignedTo = serviceRequest.assignedTo;

    try {
        const currentRequest: ServiceRequest | null = await client.serviceRequest.findUnique({
            where: { serviceID: serviceRequest.serviceID }
        });
        previousAssignedTo = currentRequest!.assignedID!;
    } catch (error) {
        console.error(error);
        return res.status(400).send("Service request with ID " + serviceRequest.serviceID + " does not exist");
    }

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

        if (previousAssignedTo !== serviceRequest.assignedTo) {
            await emailUtility.assignedServiceRequest(serviceRequest.assignedTo);
        }

        return res.status(200).send("Successfully updated service request with ID " + serviceRequest.serviceID);
    } catch (error) {
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
    } catch (error) {
        console.error(error);
        return res.status(400).send("Could not delete service request from database");
    }
});

export default router;
