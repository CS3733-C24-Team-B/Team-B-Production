import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";
import { readNodeCSV, readEdgeCSV } from "../utilities/readCSV.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {

    const node_data = readNodeCSV("./src/csvs/L1Nodes.csv");
    const edge_data = readEdgeCSV("./src/csvs/L1Edges.csv");

    try {
        await client.node.createMany({
            data: node_data
        });
        console.info("Successfully added " + node_data.length + " nodes to database");
    }
    catch (error) {
        console.error(error);
        console.error("Unable to add " + node_data.length + " nodes to database");
        res.sendStatus(400);
    }

    try {
        await client.edge.createMany({
            data: edge_data
        });
        console.info("Successfully added " + edge_data.length + " edges to database");
    }
    catch (error) {
        console.error(error);
        console.error("Unable to add " + edge_data.length + " edges to database");
        res.sendStatus(400);
    }

    res.sendStatus(200);

});

export default router;

