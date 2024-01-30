import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    // create a place to store CSV data
    let csvString: string = "nodeID,xcoord,ycoord,floor,building,nodeType,longName,shortName\n";

    // get all nodes from database
    const nodes = await client.node.findMany();

    for (let i: number = 0; i < nodes.length; i++) {
        const node = nodes[i];
        csvString += node.nodeID + "," + node.xcoord + "," + node.ycoord + "," + node.floor + "," + node.building
            + "," + node.nodeType + "," + node.longName + "," + node.shortName + "\n";
    }

    console.info("Successfully exported node data into CSV format.");

    res.send(csvString);
    console.info("Successfully sent node CSV string to frontend.");

});

export default router;
