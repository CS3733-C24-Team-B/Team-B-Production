import client from "../bin/database-connection.ts";
import { Employee, Node, Edge } from "database";
import Auth0Utility from "./Auth0Utility.ts";

export interface CSVUtility {
  readonly headers: string[];
  upload(file: Express.Multer.File): Promise<void>;
  download(): Promise<string>;
  downloadTemplate(): string;
}

export class EmployeeCSVUtility implements CSVUtility {
  readonly headers: string[] = ["email", "firstName", "lastName"];
  auth0Utility: Auth0Utility = new Auth0Utility();

  async upload(file: Express.Multer.File): Promise<void> {
    const arrayData: string[][] = parseCSV(file, this.headers);
    for (let i: number = 0; i < arrayData.length; i++) {
      const employee: string[] = arrayData[i];
      await client.employee.upsert({
        where: {
          email: employee[0],
        },
        update: {
          firstName: employee[1],
          lastName: employee[2],
        },
        create: {
          email: employee[0],
          firstName: employee[1],
          lastName: employee[2],
        },
      });
      try {
        await this.auth0Utility.createUser(employee[0]);
        await this.auth0Utility.inviteUser(employee[0]);
        console.log(
          "Successfully added and sent invite email to " + employee[0],
        );
      } catch (error) {
        console.log(
          "Could not add user and send invite email to " + employee[0],
        );
        console.error(error);
      }
    }
  }

  async download(): Promise<string> {
    const employees: Employee[] = await client.employee.findMany();
    const dataStrings: string[] = [];
    dataStrings.push(this.headers.join(","));
    for (let i: number = 0; i < employees.length; i++) {
      const employee: Employee = employees[i];
      dataStrings.push(
        [employee.email, employee.firstName, employee.lastName].join(","),
      );
    }
    return dataStrings.join("\n");
  }

  downloadTemplate(): string {
    return this.headers.join(",") + "\n";
  }
}

export class NodeCSVUtility implements CSVUtility {
  readonly headers: string[] = [
    "nodeID",
    "xcoord",
    "ycoord",
    "floor",
    "building",
    "nodeType",
    "longName",
    "shortName",
  ];

  async upload(file: Express.Multer.File): Promise<void> {
    const arrayData: string[][] = parseCSV(file, this.headers);
    for (let i: number = 0; i < arrayData.length; i++) {
      const node: string[] = arrayData[i];
      await client.node.upsert({
        where: {
          nodeID: node[0],
        },
        update: {
          xcoord: Number(node[1]),
          ycoord: Number(node[2]),
          floor: node[3],
          building: node[4],
          nodeType: node[5],
          longName: node[6],
          shortName: node[7],
        },
        create: {
          nodeID: node[0],
          xcoord: Number(node[1]),
          ycoord: Number(node[2]),
          floor: node[3],
          building: node[4],
          nodeType: node[5],
          longName: node[6],
          shortName: node[7],
        },
      });
    }
  }

  async download(): Promise<string> {
    const nodes: Node[] = await client.node.findMany();
    const dataStrings: string[] = [];
    dataStrings.push(this.headers.join(","));
    for (let i: number = 0; i < nodes.length; i++) {
      const node: Node = nodes[i];
      dataStrings.push(
        [
          node.nodeID,
          node.xcoord,
          node.ycoord,
          node.floor,
          node.building,
          node.nodeType,
          node.longName,
          node.shortName,
        ].join(","),
      );
    }
    return dataStrings.join("\n");
  }

  downloadTemplate(): string {
    return this.headers.join(",") + "\n";
  }
}

export class EdgeCSVUtility implements CSVUtility {
  readonly headers: string[] = ["edgeID", "startNode", "endNode"];

  async upload(file: Express.Multer.File): Promise<void> {
    const arrayData: string[][] = parseCSV(file, this.headers);
    for (let i: number = 0; i < arrayData.length; i++) {
      const edge: string[] = arrayData[i];
      try {
        await client.edge.upsert({
          where: {
            edgeID: edge[0],
          },
          update: {
            startNodeID: edge[1],
            endNodeID: edge[2],
          },
          create: {
            edgeID: edge[0],
            startNodeID: edge[1],
            endNodeID: edge[2],
          },
        });
      } catch (error) {
        console.error(error);
        throw new Error("Failed to upsert edge");
      }
    }
  }

  async download(): Promise<string> {
    const edges: Edge[] = await client.edge.findMany();
    const dataStrings: string[] = [];
    dataStrings.push(this.headers.join(","));
    for (let i: number = 0; i < edges.length; i++) {
      const edge: Edge = edges[i];
      dataStrings.push(
        [edge.edgeID, edge.startNodeID, edge.endNodeID].join(","),
      );
    }
    return dataStrings.join("\n");
  }

  downloadTemplate(): string {
    return this.headers.join(",") + "\n";
  }
}

function parseCSV(csvFile: Express.Multer.File, headers: string[]): string[][] {
  const numColumns: number = headers.length;
  const csvData: string = String(csvFile.buffer);
  const lines: string[] = csvData.split(/\r?\n/);
  const arrayData: string[][] = [];

  // if headers in the CSV file don't match specified headers, throw error
  if (lines[0] != headers.join(",")) {
    console.log("Actual headers: " + lines[0]);
    console.log("Expected headers: " + headers);
    throw new Error("Incorrect CSV file uploaded, incorrect headers.");
  }

  // loop through lines and put into 2D array
  for (let i: number = 1; i < lines.length; i++) {
    const data: string[] = lines[i].split(",");
    if (data.length != numColumns) {
      continue;
    }
    arrayData[i] = data;
  }

  arrayData.splice(0, 1);
  console.log(arrayData.length + " CSV lines successfully read");
  return arrayData;
}
