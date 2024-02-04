import { readFileSync } from "fs";
import {Edge, Node, PrismaClient} from "database";
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
export class aStarNode {
    nodeID: string;
    xcoord: number;
    ycoord: number;
    floor: string;
    building: string;
    nodeType: string;
    longName: string;
    shortName: string;
    gvalue: number;
    hvalue: number;
    f: number;
    parent: aStarNode | undefined;

    constructor(nodeID: string, xcoord: number, ycoord: number, floor: string, building: string, nodeType: string, longName: string, shortName: string, gvalue:number,hvalue:number) {
        this.nodeID = nodeID;
        this.xcoord = xcoord;
        this.ycoord = ycoord;
        this.floor = floor;
        this.building = building;
        this.nodeType = nodeType;
        this.shortName = shortName;
        this.longName = longName;
        this.gvalue = gvalue;
        this.hvalue = hvalue;
        this.f=0;
    }
    setParent(parent:aStarNode){
        this.parent=parent;
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


const prisma = new PrismaClient();
let nodes:Node[]=[];

const getAllNodes = async () => {
    try {
        nodes = await prisma.node.findMany();
        console.log('All nodes:', nodes);
    } catch (error) {
        console.error('Error fetching nodes:', error);
    } finally {
        await prisma.$disconnect();
    }
};

let edges:Edge[]=[];
const getAllEdges = async () => {
    try {
        edges = await prisma.edge.findMany();
        console.log('All edges:', edges);
    } catch (error) {
        console.error('Error fetching nodes:', error);
    } finally {
        await prisma.$disconnect();
    }
};
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
    getAllNodes();
    const nodeList : MapNode[] = [];
    for (let i = 1; i<nodes.length;i++) {
        const node = nodes[i];
        nodeList.push(new MapNode(node.nodeID,node.xcoord,node.ycoord,node.floor,node.building,node.nodeType,node.longName,node.shortName));
    }
    //console.log(nodeList);
    return nodeList;
}

export function createEdgeList() {
    getAllEdges();
    const edgeList : MapEdge[] = [];
    for (let i = 0; i<edges.length;i++) {
        const edge = edges[i];
        edgeList.push(new MapEdge(edge.edgeID,edge.startNodeID,edge.endNodeID));
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
export function pathFindBFS(startingNode:string,endingNode:string){
    const startNode = findNode(startingNode);
    const endNode = findNode(endingNode);
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
function mapNodeToStar(node:MapNode){
    return new aStarNode(node.nodeID,node.xcoord,node.ycoord,node.floor,node.building,node.nodeType,node.longName,node.shortName,0,0);
}
export function pathfindAStar(startingNode:string,endingNode:string){

    const startNode = mapNodeToStar(findNode(startingNode));
    const endNode = mapNodeToStar(findNode(endingNode));
    if(startingNode===endingNode){
        return [startingNode];
    }
    let graph : Graph = new Graph();
    for(const currentNode of createNodeList()){
        graph.addVertex(currentNode.nodeID);
    }
    for(const currentEdge of createEdgeList()){
        graph.addEdge(currentEdge.endNode,currentEdge.startNode);
    }

    let openList: aStarNode[] = [];
    let closedList: aStarNode[] = [];
    openList.push(startNode);


    while (openList.length>0) {
        const res = Math.min(...openList.map(o=>o.hvalue+o.gvalue));

        const q  = openList.find(function(o){ return o.hvalue+o.gvalue == res; });
       if(q !== undefined) {
           openList = openList.filter(obj => obj.nodeID !== (q as aStarNode).nodeID);
           if(graph!==null) {
               if (graph.adjacencyList !== null) {
                   if (graph.adjacencyList.has(q.nodeID)) {
                       const childrenList: aStarNode[] = (graph.adjacencyList.get(q.nodeID) as string[]).map(obj => mapNodeToStar(findNode(obj)));
                       childrenList.forEach(obj => obj.parent = q);
                       for (const child of childrenList) {
                           if (child.nodeID === endingNode) {
                                const path:string[] = [];
                                let node = child;
                                path.push(node.nodeID);
                                while(node.parent!=null){
                                    path.push(node.parent.nodeID);
                                    node=node.parent;
                                }
                                return path.reverse();
                           } else {
                               child.gvalue = q.gvalue + Math.sqrt((q.xcoord - child.xcoord) ** 2 + (q.ycoord - child.ycoord) ** 2);
                               child.hvalue = Math.sqrt((endNode.xcoord - child.xcoord) ** 2 + (endNode.ycoord - child.ycoord) ** 2);
                               child.f = child.gvalue + child.hvalue;
                           }
                           if (openList.filter(obj => ((obj.f < child.f)&&(obj.nodeID===child.nodeID))).length === 0 && closedList.filter(obj => (obj.nodeID===child.nodeID&&obj.f < child.f)).length === 0) {
                               openList.push(child);
                           }
                       }
                       closedList.push(q);
                   }
               }
           }
       }
    }
}

