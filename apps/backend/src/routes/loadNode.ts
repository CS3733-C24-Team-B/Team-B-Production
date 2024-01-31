import express, { Router, Request, Response } from "express";
import multer from "multer";
import { Prisma, Node } from "database";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });

router.get("/", async function (req: Request, res: Response) {

    // create a place to store CSV data
    let csvString: string = "nodeID,xcoord,ycoord,floor,building,nodeType,longName,shortName\n";

    // get all nodes from database
    const nodes: Node[] = await client.node.findMany();

    for (let i: number = 0; i < nodes.length; i++) {
        const node: Node = nodes[i];
        csvString += node.nodeID + "," + node.xcoord + "," + node.ycoord + "," + node.floor + "," + node.building
            + "," + node.nodeType + "," + node.longName + "," + node.shortName + "\n";
    }

    console.info("Successfully exported node data into CSV format.");

    res.send(csvString);
    console.info("Successfully sent node CSV string to frontend.");

});

router.post("/", upload.single("csvFile"), async function (req: Request, res: Response) {

    const nodeFile = req.file;

    if (!nodeFile) {
        console.error("No file was uploaded");
        return res.sendStatus(400);
    }

    const nodeData: Node[] = [];

    try {
        const requestData: string = String(nodeFile.buffer);
        const lines: string[] = requestData.split(/\r?\n/);
        lines.splice(0, 1);                     // remove 1st line (column headings)
        lines.splice(lines.length - 1, 1);      // remove last line (empty line)

        // loop through lines and put into JSON format
        for (let i: number = 0; i < lines.length; i++) {
            const data: string[] = lines[i].split(',');
            if (data.length != 8) {
                continue;
            }
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
    }
    catch (error) {
        console.error(error);
        console.error("Unable to read node CSV file");
        return res.sendStatus(400);
    }

    try {
        await client.node.createMany({
            data: nodeData
        });
        console.info("Successfully added " + nodeData.length + " nodes to database");
    }
    catch (error) {
        console.error("Unable to add " + nodeData.length + " nodes to database");
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
            console.error("This data already exists in the database, please upload new data");
        }
        else {
            console.error(error);
        }
        return res.sendStatus(400);
    }

    return res.sendStatus(200);
});

export default router;