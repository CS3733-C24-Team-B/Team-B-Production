import {UpdateEmployee} from "./employeeTypes.ts";

export type NewServiceRequest = {
    createdByID: string,
    locationID: string,
    priority: PriorityType,
    status: StatusType,
    assignedID: string,
    notes: string
}

export type UpdateServiceRequest =  {
    serviceID: number,
    assignedTo: string,
    status: StatusType
}

export type SanitationRequest = NewServiceRequest & {
    hazards: string
}

export type MaintenanceRequest = NewServiceRequest & {
    details: string
}

export type InternalTransportRequest = NewServiceRequest & {
    toLocation: string,
    mobilityAid: string,
    patientName: string
}

export type MedicineRequest = NewServiceRequest & {
    medicineType: string,
    amount: string
}

export type LanguageRequest = NewServiceRequest & {
    language1: string,
    language2: string,
    when: Date
}

export type DeleteRequest = {
    serviceID: number
}
export type UpdateRequest = {
    serviceID: number,
    assignedTo: string,
    status: StatusType
}

export enum RequestType {
    sanitation = "Sanitation",
    medicine = "Medicine",
    internalTransport = "Internal Transport",
    maintenance = "Maintenance",
    language = "Language"
}

export enum StatusType {
    Unassigned = "Unassigned",
    Assigned = "Assigned",
    InProgress = "In Progress",
    Completed = "Completed",
    Paused = "Paused"
}

export enum PriorityType {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Emergency = "Emergency"
}

export interface ServiceRequest {
    serviceID: number,
    timeCreated: string,
    createdBy: UpdateEmployee,
    createdByID: string,
    locationID: string,
    priority: string,
    status: string,
    assignedTo: UpdateEmployee,
    assignedID: string,
    notes: string,
    sanitation: SanitationRequest,
    maintenance: MaintenanceRequest,
    internalTransport: InternalTransportRequest,
    medicine: MedicineRequest,
    language: LanguageRequest,
}


