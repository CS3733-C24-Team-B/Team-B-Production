import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    // create a place to store CSV data
    let csvString: string = "edgeID,startNode,endNode\n";

    // get all edges from database
    const edges = await client.edge.findMany();

    for (let i: number = 0; i < edges.length; i++) {
        const edge = edges[i];
        csvString += edge.edgeID + "," + edge.startNodeID + "," + edge.endNodeID + "\n";
    }

    console.info("Successfully exported edge data into CSV format.");

    res.send(csvString);
    console.info("Successfully sent edge CSV string to frontend.");

});

export default router;
