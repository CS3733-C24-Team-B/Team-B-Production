import express, { Router, Request, Response } from "express";
import multer from "multer";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("test"), async function (req: Request, res: Response) {

    const edgeFile = req.file;

    if (!edgeFile) {
        res.sendStatus(400);
        console.error("No file was uploaded");
        return;
    }

    const edgeData = [];

    const requestData: string = String(edgeFile.buffer);
    const lines: string[] = requestData.split(/\r?\n/);
    lines.splice(0, 1);                     // remove 1st line (column headings)
    lines.splice(lines.length - 1, 1);      // remove last line (empty line)

    // loop through lines and put into JSON format
    for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(',');
        edgeData[i] = {
            edgeID: data[0],
            startNodeID: data[1],
            endNodeID: data[2]
        };
    }

    console.log(edgeData.length + " edges read");

    try {
        await client.edge.createMany({
            data: edgeData
        });
        console.info("Successfully added " + edgeData.length + " edges to database");
    }
    catch (error) {
        console.error(error);
        console.error("Unable to add " + edgeData.length + " edges to database");
        res.sendStatus(400);
        return;
    }

    res.sendStatus(200);
    return;
});

export default router;

