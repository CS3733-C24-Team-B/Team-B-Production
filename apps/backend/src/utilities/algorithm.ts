import { readFileSync } from "fs";
import {Edge, Node, PrismaClient} from "database";
export interface searchStrategy {
     search(startNode:string,endNode:string):string[]|undefined;
}
export class Pathfind {
    private searchStrat:searchStrategy;
    constructor(searchStrat:searchStrategy) {
        this.searchStrat=searchStrat;
    }
    search(startNode:string,endNode:string){
        return this.searchStrat.search(startNode,endNode);
    }

}
export class AStar implements searchStrategy{
    search(startNode: string, goalNode: string): string[] | undefined {
        const nodeList = createNodeList();
        const edgeList = createEdgeList();
        const start =mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID===startNode)as MapNode);
        const goal =mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID===goalNode)as MapNode);
        const graph = createGraph(nodeList,edgeList);
        //queue to search
        let openList= [start];
        //already searched
        let closedList:aStarNode[] =[];
        //while there are still nodes left to search
        while (openList.length > 0) {
            //get currenet node
            const currentNode = openList.reduce((minNode, node) => (node.f < minNode.f ? node : minNode), openList[0]);
            //remove current node from queue
            openList = openList.filter(node => !(node.nodeID === currentNode.nodeID));
            //add current node to searched
            closedList.push(currentNode);
            //if current node is the goal
            if (currentNode.nodeID === goal.nodeID) {
                //return the path
                const path: aStarNode[] = [];
                let current = currentNode;
                while (current) {
                    path.push(current);
                    current = current.parent!;
                }
                return path.reverse().map(obj => obj.nodeID);
            }
            //get nodes with edges connected to current node
            const neighborsNode = (graph.adjacencyList.get(currentNode.nodeID));
            if (neighborsNode) {
                const neighbors = neighborsNode.map(obj => mapNodeToStar(nodeList.find(MapNode => MapNode.nodeID === obj) as MapNode));

                //go through the nodes connected to current
                for (const neighbor of neighbors) {
                    //skip if node is already searched
                    if (closedList.some(node => node.nodeID === neighbor.nodeID)) {
                        continue;
                    }
                    //g value is 1 greater than currents
                    const tentativeG = currentNode.gvalue + 1;
                    //if openlist doesnt already have this node or the parent g is less than this nodes g
                    if (!openList.some(node => node.nodeID === neighbor.nodeID) || tentativeG < neighbor.gvalue) {
                        //set g to parent g+1
                        neighbor.gvalue = tentativeG;
                        const floorWeight = 300;
                        //heuristic for current distance to goal node.
                        neighbor.hvalue = Math.sqrt((goal.xcoord - neighbor.xcoord) ** 2 + (goal.ycoord - neighbor.ycoord) ** 2 + ((nodeToFloor(goal)-nodeToFloor(neighbor))*floorWeight )** 2);
                        //f is g+h
                        neighbor.f = neighbor.gvalue + neighbor.hvalue;
                        //set nodes parent to current node
                        neighbor.parent = currentNode;
                        //if open list does not contain this node, add it.
                        if (!openList.some(node => node.nodeID === neighbor.nodeID)) {
                            openList.push(neighbor);
                        }
                    }
                }
            }
        }
        return undefined;
    }

}
export class BFS implements searchStrategy{

    search(startingNode:string,endingNode:string){
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
        return undefined;
    }
}
export class DFS implements searchStrategy{

    search (startingNode: string, endingNode: string) {
        const nodeList = createNodeList();
        const edgeList = createEdgeList();
        const graph = createGraph(nodeList, edgeList);
        const startNode = findNode(startingNode);
        const endNode = findNode(endingNode);
        const visited: Set<string> = new Set();
        const stack: string[][] = [[startNode.nodeID]];
        visited.add(startNode.nodeID);

        while (stack.length > 0) {
            const currentPath = stack.pop()!;
            const currentVertex = currentPath[currentPath.length - 1];
            if (currentVertex === endNode.nodeID) {
                console.log(currentPath);
                return currentPath;
            }

            const neighbors: string[] = graph.adjacencyList.get(currentVertex) || [];

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor)) {
                    visited.add(neighbor);
                    const newPath: string[] = [...currentPath, neighbor];
                    stack.push(newPath);
                }
            }
        }
        return undefined;
    }
}
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
export class aStarNode implements MapNode {
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
function mapNodeToStar(node:MapNode){
    return new aStarNode(node.nodeID,node.xcoord,node.ycoord,node.floor,node.building,node.nodeType,node.longName,node.shortName,0,0);
}
export function nodeToFloor(node:aStarNode){
    if(node.floor.length>1){
        return -parseInt(node.floor.substring(1));
    }else{
        return parseInt(node.floor);
    }
}


