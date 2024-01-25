import { readFileSync } from "fs";

class MapNode {
    nodeID: string;
    xcoord: number;
    ycoord: number;
    floor: string;
    building: string;
    nodeType: string;
    longName: string;
    shortName: string;

    constructor(nodeID: string, xcoord: number, ycoord: number, floor: string, building: string, nodeType: string, longName: string, shortName: string) {
        this.nodeID = nodeID;
        this.xcoord = xcoord;
        this.ycoord = ycoord;
        this.floor = floor;
        this.building = building;
        this.nodeType = nodeType;
        this.shortName = shortName;
        this.longName = longName;
    }
}
class MapEdge {
    edgeID: string;
    startNode: string; //foreign key nodeID
    endNode: string; // foreign key nodeID
    constructor(edgeID: string, startNode: string, endNode: string) {
        this.edgeID = edgeID;
        this.startNode = startNode;
        this.endNode = endNode;
    }
}
class Graph {
    adjacencyList: Map<string, string[]>;

    constructor() {
        this.adjacencyList = new Map();
    }
    addVertex(vertex: string): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }
    addEdge(vertex1: string, vertex2: string): void {
        // Check if vertices exist in the graph
        if (!this.adjacencyList.has(vertex1) || !this.adjacencyList.has(vertex2)) {
            return;
        }

        // Add vertex2 to the adjacency list of vertex1
        this.adjacencyList.get(vertex1)?.push(vertex2);

        // Add vertex1 to the adjacency list of vertex2
        this.adjacencyList.get(vertex2)?.push(vertex1);
    }
}
export function findNode(nodeID: string) : MapNode{
    //return array.find(obj => obj.id === id);
    //console.log(createNodeList()[7]);
   // console.log(createNodeList().find(MapNode => MapNode.nodeID === nodeID));
    return createNodeList().find(MapNode => MapNode.nodeID === nodeID) as MapNode;
}


/*
read data from NodeCSV and export in JSON:
format:
"data": {
    "nodeID": "CCONF001L1",
    "xcoord": 2255,
    "ycoord": 849,
    "floor": "L1",
    "building": "45 Francis",
    "nodeType": "CONF",
    "longName": "Anesthesia Conf Floor L1",
    "shortName":"Conf C001L1"
 */
export function readNodeCSV(filePath:string){
    const NodeData = [];
    const fileContent: string = readFileSync(filePath, "utf-8");
    const lines: string[] = fileContent.split(/\r?\n/);
    lines.pop();
    for (let i: number = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        NodeData[i] = {
            data: {
                "nodeID": data[0],
                "xcoord": data[1],
                "ycoord": data[2],
                "floor": data[3],
                "building": data[4],
                "nodeType": data[5],
                "longName": data[6],
                "shortName": data[7]
            }
        };
    }

    //console.log(NodeData);
    return NodeData;
}
export function readEdgeCSV(filePath:string){
    const edgeData = [];
    const fileContent: string = readFileSync(filePath, "utf-8");
    const lines: string[] = fileContent.split(/\r?\n/);
    lines.pop();
    for (let i: number = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        edgeData[i] = {
            data:{
                "edgeID": data[0],
                "startNode": data[1],
                "endNode": data[2]
            }
        };
    }

    //console.log(NodeData);
    return edgeData;
}

//use to iterate/print out different values of each node
export function createNodeList() {
    const filePath = "src/csvs/L1Nodes.csv";
    const nodes = readNodeCSV(filePath);
    const nodeList : MapNode[] = [];
    for (let i = 1; i<nodes.length;i++) {
        const node = nodes[i];
        nodeList.push(new MapNode(node.data.nodeID,parseInt(node.data.xcoord),parseInt(node.data.ycoord),node.data.floor,node.data.building,node.data.nodeType,node.data.longName,node.data.shortName));
    }
    //console.log(nodeList);
    return nodeList;
}

export function createEdgeList() {
    const filePath = "src/csvs/L1Edges.csv";
    const edges = readEdgeCSV(filePath);
    const edgeList : MapEdge[] = [];
    for (let i = 1; i<edges.length;i++) {
        const edge = edges[i];
        edgeList.push(new MapEdge(edge.data.edgeID,edge.data.startNode,edge.data.endNode));
    }
   // console.log(edgeList);
    return edgeList;
}


export function breadthFirstSearch(){
    let graph : Graph = new Graph();
    for(const currentNode of createNodeList()){
        graph.addVertex(currentNode.nodeID);
    }
    for(const currentEdge of createEdgeList()){
        graph.addEdge(currentEdge.endNode,currentEdge.startNode);
    }
    const visited: Set<string> = new Set();
    const queue: string[] = [];
    const result: string[] = [];

    visited.add(createNodeList()[0].nodeID);
    queue.push(createNodeList()[0].nodeID);


    while (queue.length > 0) {
        const currentVertex = queue.shift()!;
        result.push(currentVertex);
        const neighbors : string[] = graph.adjacencyList.get(currentVertex) || [];
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                //console.log("visited: "+neighbor);
                queue.push(neighbor);

            }
        }
    }
    console.log(result);
    return result;
}
export function pathFindBFS(startNode:MapNode,endNode:MapNode){
    let graph : Graph = new Graph();
    for(const currentNode of createNodeList()){
        graph.addVertex(currentNode.nodeID);
    }
    for(const currentEdge of createEdgeList()){
        graph.addEdge(currentEdge.endNode,currentEdge.startNode);
        graph.addEdge(currentEdge.startNode,currentEdge.endNode);
    }
    const visited: Set<string> = new Set();
    const queue: string[][] = [[startNode.nodeID]];
    visited.add(startNode.nodeID);

    while (queue.length > 0) {
        const currentPath = queue.shift()!;
        const currentVertex = currentPath[currentPath.length-1];
        if(currentVertex===endNode.nodeID){
            console.log(currentPath);
            return currentPath;
        }

        const neighbors : string[] = graph.adjacencyList.get(currentVertex) || [];

        for (const neighbor of neighbors) {
            if (!visited.has(neighbor)) {
                visited.add(neighbor);
                const newPath : string[] =[...currentPath,neighbor];
                queue.push(newPath);
            }
        }
    }
    return null;
}
//const filePath = "src/csvs/L1Nodes.csv";
//console.log(readCSV(filePath));
//const filePath = "src/csvs/L1Edges.csv";
//console.log(readCSV(filePath));
/*bfs(startingVertex: number): number[] {
    const visited: Set<number> = new Set();
    const queue: number[] = [];
    const result: number[] = [];

    visited.add(startingVertex);
    queue.push(startingVertex);

    while (queue.length > 0) {
      const currentVertex = queue.shift()!;
      result.push(currentVertex);

      const neighbors = this.adjacencyList.get(currentVertex) || [];

      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    return result;
  }
}*/
