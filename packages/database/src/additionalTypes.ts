import {Prisma} from "database";

export type EmployeeWithSR = Prisma.EmployeeGetPayload<{
    include: {
        requestsAssigned: {
            include: {
                sanitation: true,
                maintenance: true,
                internalTransport: true,
                medicine: true,
                language: true
                createdBy: true,
                assignedTo: true,
                location: true
            }
        }
    }
}>

export type ServiceRequestWithTypes = Prisma.ServiceRequestGetPayload<{
    include: {
        sanitation: true,
        maintenance: true,
        internalTransport: true,
        medicine: true,
        language: true
        createdBy: true,
        assignedTo: true
        location: true
    }
}>
