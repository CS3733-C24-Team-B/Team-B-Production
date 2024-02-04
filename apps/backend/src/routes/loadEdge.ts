import express, { Router, Request, Response } from "express";
import multer from "multer";
import {Prisma, Edge} from "database";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });

router.get("/", async function (req: Request, res: Response) {

    const edge_data: Edge[] = await client.edge.findMany();
    if (edge_data === null) {
        console.error("No edge data found in database");
        res.sendStatus(204);    // no data
    }
    else {
        res.send(JSON.stringify(edge_data));
        console.info("Successfully sent " + edge_data.length + " edges to frontend");
    }

});

router.post("/", upload.single("csvFile"), async function (req: Request, res: Response) {

    const edgeFile = req.file;

    if (!edgeFile) {
        console.error("No file was uploaded");
        return res.sendStatus(400);
    }

    const edgeData: Edge[] = [];

    try {
        const requestData: string = String(edgeFile.buffer);
        const lines: string[] = requestData.split(/\r?\n/);
        lines.splice(0, 1);                     // remove 1st line (column headings)
        lines.splice(lines.length - 1, 1);      // remove last line (empty line)

        // loop through lines and put into JSON format
        for (let i: number = 0; i < lines.length; i++) {
            const data: string[] = lines[i].split(',');
            if (data.length != 3) {
                continue;
            }
            edgeData[i] = {
                edgeID: data[0],
                startNodeID: data[1],
                endNodeID: data[2]
            };
        }

        console.log(edgeData.length + " edges read");
    }
    catch (error) {
        console.error(error);
        console.error("Unable to read edge CSV file");
        return res.sendStatus(400);
    }

    try {
        await client.edge.createMany({
            data: edgeData
        });
        console.info("Successfully added " + edgeData.length + " edges to database");
    }
    catch (error) {
        console.error("Unable to add " + edgeData.length + " edges to database");
        if (error instanceof Prisma.PrismaClientKnownRequestError && error.code == 'P2002') {
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
