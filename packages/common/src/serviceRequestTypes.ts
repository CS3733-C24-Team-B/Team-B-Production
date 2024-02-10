export type NewRequest = {
    name: string,
    roomNumber: number,
    infoText: string
}

export type DeleteRequest = {
    serviceID: number
}

export type ServiceAssignment = {
    serviceID: number,
    assignedTo: string
}

export type ServiceStatus = {
    serviceID: number,
    status: StatusType
}

export type UpdateRequest = {
    serviceID: number,
    assignedTo: string,
    status: StatusType
}

export enum StatusType {
    Unassigned = "Unassigned",
    Assigned = "Assigned",
    InProgress = "In Progress",
    Completed = "Completed"
}
