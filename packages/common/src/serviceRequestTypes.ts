export type NewRequest = {
    name: string,
    roomNumber: number,
    infoText: string
}

export type DeleteRequest = {
    serviceID: number
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
    Completed = "Completed",
    Paused = "Paused"
}

export enum PriorityType {
    Low = "Low",
    Medium = "Medium",
    High = "High",
    Emergency = "Emergency"
}
