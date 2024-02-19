import express, { Router, Request, Response } from "express";
import multer from "multer";
import client from "../bin/database-connection.ts";
import {NodeCSVUtility} from "../utilities/CSVUtility.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });
const csvUtility: NodeCSVUtility = new NodeCSVUtility();

router.get("/download", async function (req: Request, res: Response) {
    const blob: Blob = await csvUtility.download();
    return res.status(200).send(blob);
});

router.post("/upload", upload.single("csvFile"), async function (req: Request, res: Response) {

    const nodeFile = req.file;

    if (!nodeFile) {
        console.error("No file was uploaded");
        return res.sendStatus(400);
    }

    try {
        await csvUtility.upload(nodeFile);
        return res.status(200).send("Successfully added nodes");
    }
    catch (error) {
        console.error(error);
        return res.sendStatus(400);
    }
});

router.get("/download-template", function (req: Request, res: Response) {
    const blob: Blob = csvUtility.downloadTemplate();
    return res.status(200).send(blob);
});

router.delete("/", async function (req: Request, res: Response) {
    try {
        client.node.deleteMany({});
        return res.status(200).send("Successfully cleared node data from database");
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not clear node data from database");
    }
});

export default router;
