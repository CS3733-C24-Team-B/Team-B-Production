class MapEdge {
    edgeID: string;
    startNode: string; //foreign key nodeID
    endNode: string; // foreign key nodeID
    constructor(edgeID:string,startNode:string,endNode:string) {
        this.edgeID=edgeID;
        this.startNode=startNode;
        this.endNode=endNode;
    }
}
