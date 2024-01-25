import { readFileSync } from "fs";
// import * as path from "path";
// import * as fs from "fs";
// import {G} from "vitest/dist/types-198fd1d9";
// import {start} from "http-errors";

export class MapNode {
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
export class MapEdge {
    edgeID: string;
    startNode: string; //foreign key nodeID
    endNode: string; // foreign key nodeID
    constructor(edgeID: string, startNode: string, endNode: string) {
        this.edgeID = edgeID;
        this.startNode = startNode;
        this.endNode = endNode;
    }
}
// class Graph {
//     adjacencyList: Map<MapNode, MapNode[]>;
//
//     constructor() {
//         this.adjacencyList = new Map();
//     }
//     addVertex(vertex: MapNode): void {
//         if (!this.adjacencyList.has(vertex)) {
//             this.adjacencyList.set(vertex, []);
//         }
//     }
//
//     addEdge(vertex1: MapNode, vertex2: MapNode): void {
//         this.adjacencyList.get(vertex1)?.push(vertex2);
//         this.adjacencyList.get(vertex2)?.push(vertex1);
//     }
// }
//const nodeList: MapNode[] = [];
//const edgeList: MapEdge[] = [];
export function findNode(nodeID: string) : MapNode{
    //return array.find(obj => obj.id === id);
    //console.log(createNodeList()[7]);
   // console.log(createNodeList().find(MapNode => MapNode.nodeID === nodeID));
    return createNodeList().find(MapNode => MapNode.nodeID === nodeID) as MapNode;
}

// export function readCSV(filePath: string): string[] {
//     //Read the file
//     const fileContent = readFileSync(filePath, "utf8");
//
//     //Split the file content by new line to get the rows
//     const lines = fileContent.split("\n");
//
//     //Extract headers
//     const headers = lines[0].split(",");
//
//     //Parse each line
//     const data = lines.slice(1).map((line) => {
//         const values = line.split(",");
//         return headers.reduce((obj, header, index) => {
//             obj[header] = values[index];
//             return obj;
//         }, {} as any);
//     });
//
//     return data;
// }
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
    const lines: string[] = fileContent.split('\n');

    for (let i: number = 1; i < lines.length; i++) {
        const data = lines[i].split(',');
        NodeData[i] = {
            data:{
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
    console.log(NodeData);
    return NodeData;
}


//use to iterate/print out different values of each node
export function createNodeList() {
    const filePath = "src/csvs/L1Nodes.csv";
    const nodeString = readNodeCSV(filePath);
    const nodes: MapNode[] = [];
    nodeString.pop();
    for (const node of nodeString) {
        nodes.push(
        new MapNode(node.data.nodeID,parseInt(node.data.xcoord),parseInt(node.data.ycoord),node.data.floor,node.data.building,node.data.nodeType,node.data.longName,node.data.shortName));

        //console.log(newNode);
    }
    return nodes;
}

// export function createEdgeList() {
//     const filePath = "src/csvs/L1Edges.csv";
//     const edgeString = readCSV(filePath);
//     const edges: string[] = [];
//     for (const edge of edgeString) {
//         edges.push(edge);
//     }
//
//     edges.pop();
//     for (const edge of edges) {
//             const curr = JSON.stringify(edge);
//             let curredge: string[]= curr.split(",");
//             curredge=curredge.map(obj => obj.substring(obj.indexOf(":")+2,obj.length-1));
//             curredge[2]=curredge[2].substring(0,curredge[2].length-3);
//            // console.log(curredge);
//
//             const newEdge: MapEdge = new MapEdge(curredge[0], curredge[1], curredge[2]);
//             edgeList.push(newEdge);
//     }
//
//     //console.log(edgeList);
//     return edgeList;
// }

// export function breadthFirstSearch(){
//     let graph : Graph = new Graph();
//     for(const currentNode of createNodeList()){
//         graph.addVertex(currentNode);
//     }
//     for(const currentEdge of createEdgeList()){
//         graph.addEdge(findNode(currentEdge.endNode),findNode(currentEdge.startNode));
//         graph.addEdge(findNode(currentEdge.startNode),findNode(currentEdge.endNode));
//     }
//     const visited: Set<MapNode> = new Set();
//     const queue: MapNode[] = [];
//     const result: MapNode[] = [];
//
//     visited.add(createNodeList()[0]);
//     queue.push(createNodeList()[0]);
//
//     while (queue.length > 0) {
//         const currentVertex = queue.shift()!;
//         result.push(currentVertex);
//
//         const neighbors : MapNode[] = graph.adjacencyList.get(currentVertex) || [];
//
//         for (const neighbor of neighbors) {
//             if (!visited.has(neighbor)) {
//                 visited.add(neighbor);
//                 queue.push(neighbor);
//
//             }
//         }
//     }
//     //console.log(result.map(obj => obj.nodeID));
//     return result;
// }
// export function pathFindBFS(startNode:MapNode,endNode:MapNode){
//     let graph : Graph = new Graph();
//     for(const currentNode of createNodeList()){
//         graph.addVertex(currentNode);
//     }
//     for(const currentEdge of createEdgeList()){
//         graph.addEdge(findNode(currentEdge.endNode),findNode(currentEdge.startNode));
//         graph.addEdge(findNode(currentEdge.startNode),findNode(currentEdge.endNode));
//     }
//     const visited: Set<MapNode> = new Set();
//     const queue: MapNode[][] = [[startNode]];
//     visited.add(startNode);
//
//     while (queue.length > 0) {
//         const currentPath = queue.shift()!;
//         const currentVertex = currentPath[currentPath.length-1];
//         if(currentVertex===endNode){
//             console.log(currentPath);
//             return currentPath;
//         }
//
//         const neighbors : MapNode[] = graph.adjacencyList.get(currentVertex) || [];
//
//         for (const neighbor of neighbors) {
//             if (!visited.has(neighbor)) {
//                 visited.add(neighbor);
//                 const newPath : MapNode[] =[...currentPath,neighbor];
//                 queue.push(newPath);
//             }
//         }
//     }
//     return null;
// }
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
