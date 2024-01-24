import {readFileSync} from "fs";

//import { MapNode } from "./Node.ts";
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
        this.longName = longName;
        this.shortName = shortName;
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
    private adjacencyList: Map<MapNode, MapNode[]>;

    constructor() {
        this.adjacencyList = new Map();
    }
    addVertex(vertex: MapNode): void {
        if (!this.adjacencyList.has(vertex)) {
            this.adjacencyList.set(vertex, []);
        }
    }

    addEdge(vertex1: MapNode, vertex2: MapNode): void {
        this.adjacencyList.get(vertex1)?.push(vertex2);
        this.adjacencyList.get(vertex2)?.push(vertex1);
    }
}
const nodeList: MapNode[] = [];
const edgeList: MapEdge[] = [];
export function readCSV(filePath: string): any[] {
  //Read the file
  const fileContent = readFileSync(filePath, "utf8");

  //Split the file content by new line to get the rows
  const lines = fileContent.split("\n");

  //Extract headers
  const headers = lines[0].split(",");

  //Parse each line
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as any);
  });

  return data;
}

/**
 * Reads data from an edge CSV file and returns a list of JSON objects.
 *
 * Format example:
 * data: {
 *     edgeID: 'CCONF002L1_WELEV00HL1',
 *     startNodeID: 'CCONF002L1',
 *     endNodeID: 'WELEV00HL1'
 * }
 *
 * @param filePath
 * @return edgeData
 */
export function readEdgeCSV(filePath: string) {

    // create place to store edge data in JSON format
    const edgeData = [];

    // read file
    const fileContent: string = readFileSync(filePath, "utf-8");
    const lines: string[] = fileContent.split('\n');
    lines.splice(0, 1);                     // remove 1st line (column headings)
    lines.splice(lines.length - 1, 1);      // remove last line (empty line)

    // loop through lines and put into JSON format
    for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(',');
        edgeData[i] = {
            data: {
                edgeID: data[0],
                startNodeID: data[1],
                endNodeID: data[2]
            }
        };
    }

    console.log(edgeData);
    console.log(edgeData.length + " edges read");

    return edgeData;
}

//use to iterate/print out different values of each node
export function createNodeList() {
  const filePath = "src/csvs/L1Nodes.csv";
  const nodeString = readCSV(filePath);
  const nodes: string[] = [];
  for (const node of nodeString) {
    nodes.push(node);
  }
  nodeList.pop();
  for (const node of nodes) {
    const curr = JSON.stringify(node);
    let currNode: string[]= curr.substring(68, curr.length - 2).split(" ");
    const newNode: MapNode = new MapNode(currNode[0],parseInt(currNode[1]),parseInt(currNode[2]),currNode[3],currNode[4],currNode[5],currNode[6],currNode[7]);
    nodeList.push(newNode);
  }
  return nodeList;
}
export function createEdgeList() {
    const filePath = "src/csvs/L1Edges.csv";
    const edgeString = readCSV(filePath);
    const edges: string[] = [];
    for (const edge of edgeString) {
        edges.push(edge);
    }
edges.pop();
let x = 1;
    for (const edge of edges) {
        if(x==1) {
            x = 2;
        }
        else {
            const curr = JSON.stringify(edge);
            let curredge: string[] = [];
            curredge[0] = curr.substring(7, 28);
            curredge[1] = curr.substring(28, 38);
            curredge[2] = curr.substring(38, 48);
            const newEdge: MapEdge = new MapEdge(curredge[0], curredge[1], curredge[2]);
            edgeList.push(newEdge);
        }
    }
    return edgeList;
}

/*export function breadthFirstSearch(listEdges: MapEdge[], listNodes: MapNode[]){

}*/
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
