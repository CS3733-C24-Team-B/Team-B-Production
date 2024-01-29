import express, { Router, Request, Response } from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.post("/", async function (req: Request, res: Response) {

    const nodeData = [];

    const requestData = req.body;
    const lines: string[] = requestData.split(/\r?\n/);
    lines.splice(0, 1);                     // remove 1st line (column headings)
    lines.splice(lines.length - 1, 1);      // remove last line (empty line)

    // loop through lines and put into JSON format
    for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(',');
        nodeData[i] = {
            nodeID: data[0],
            xcoord: Number(data[1]),
            ycoord: Number(data[2]),
            floor: data[3],
            building: data[4],
            nodeType: data[5],
            longName: data[6],
            shortName: data[7]
        };
    }

    console.log(nodeData.length + " nodes read");

    try {
        await client.node.createMany({
            data: nodeData
        });
        console.info("Successfully added " + nodeData.length + " nodes to database");
    }
    catch (error) {
        console.error(error);
        console.error("Unable to add " + nodeData.length + " nodes to database");
        res.sendStatus(400);
    }

    res.sendStatus(200);

});

export default router;

