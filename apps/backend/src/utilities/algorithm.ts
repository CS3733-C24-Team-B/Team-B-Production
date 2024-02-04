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
function createGraph(nodeList:MapNode[],edgeList:MapEdge[]){

    let graph : Graph = new Graph();
    for(const currentNode of nodeList){
        graph.addVertex(currentNode.nodeID);
    }
    for(const currentEdge of edgeList){
        graph.addEdge(currentEdge.endNode,currentEdge.startNode);
    }
    return graph;
}

export function breadthFirstSearch(){

    const nodeList = createNodeList();
    const edgeList = createEdgeList();
    const graph = createGraph(nodeList,edgeList);

    const visited: Set<string> = new Set();
    const queue: string[] = [];
    const result: string[] = [];

    visited.add(nodeList[0].nodeID);
    queue.push(nodeList[0].nodeID);


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
    const nodeList = createNodeList();
    const edgeList = createEdgeList();
    const graph = createGraph(nodeList,edgeList);
    const startNode = findNode(startingNode);
    const endNode = findNode(endingNode);
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

export function pathfindAStar(startNode: string, goalNode: string): string[] | undefined {
    const nodeList = createNodeList();
    const edgeList = createEdgeList();
    const start =mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID===startNode)as MapNode);
    const goal =mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID===goalNode)as MapNode);
    const graph = createGraph(nodeList,edgeList);
    let openList= [start];
    let closedList:aStarNode[] =[];
    while (openList.length > 0) {
        const currentNode = openList.reduce((minNode, node) => (node.f < minNode.f ? node : minNode), openList[0]);

        openList = openList.filter(node => !(node.nodeID === currentNode.nodeID));
        closedList.push(currentNode);

        if (currentNode.nodeID === goal.nodeID) {
            const path: aStarNode[] = [];
            let current = currentNode;
            while (current) {
                path.push(current);
                current = current.parent!;
            }
            return path.reverse().map(obj => obj.nodeID);
        }

        const neighbors = (graph.adjacencyList.get(currentNode.nodeID) as string[]).map(obj => mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID===obj)as MapNode));

        for (const neighbor of neighbors) {
            if (closedList.some(node => node.nodeID === neighbor.nodeID)) {
                continue;
            }

            const tentativeG = currentNode.gvalue + 1;

            if (!openList.some(node => node.nodeID === neighbor.nodeID) || tentativeG < neighbor.gvalue) {
                neighbor.gvalue = tentativeG;
                neighbor.hvalue = Math.sqrt((goal.xcoord - neighbor.xcoord) ** 2 + (goal.ycoord - neighbor.ycoord) ** 2);
                neighbor.f = neighbor.gvalue + neighbor.hvalue;
                neighbor.parent = currentNode;

                if (!openList.some(node => node.nodeID === neighbor.nodeID )) {
                    openList.push(neighbor);
                }
            }
        }
    }
    return undefined;
}


