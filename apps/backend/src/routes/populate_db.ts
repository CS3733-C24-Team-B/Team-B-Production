import express, { Router, Request, Response } from "express";
// import { Prisma } from "database";
import PrismaClient from "../bin/database-connection.ts";
import {readCSV} from "../utilities/algorithm.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {

    const edge_data = readCSV("../csvs/L1Edges.csv");
    // const node_data = readCSV("../csvs/L1Nodes.csv");

    for (let i: number = 0; i < edge_data.length; i++) {

        try {
            await PrismaClient.edge.create(edge_data[i]);
            console.info("Successfully added edge " + edge_data[i] + " to database");
        }
        catch (error) {
            console.error("Unable to add edge " + edge_data[i] + " to database");
            res.sendStatus(400);
            return;
        }

        res.sendStatus(200);

    }
});

export default router;

