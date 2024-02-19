import express, { Router, Request, Response } from "express";
import multer from "multer";
import client from "../bin/database-connection.ts";
import {EdgeCSVUtility} from "../utilities/CSVUtility.ts";

const router: Router = express.Router();
const upload: multer.Multer = multer({ storage: multer.memoryStorage() });
const csvUtility: EdgeCSVUtility = new EdgeCSVUtility();

router.get("/download", async function (req: Request, res: Response) {
    const blob: Blob = await csvUtility.download();
    return res.status(200).send(blob);
});

router.post("/upload", upload.single("csvFile"), async function (req: Request, res: Response) {

    const edgeFile = req.file;

    if (!edgeFile) {
        console.error("No file was uploaded");
        return res.sendStatus(400);
    }

    try {
        await csvUtility.upload(edgeFile);
        return res.status(200).send("Successfully added edges");
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
        client.edge.deleteMany({});
        return res.status(200).send("Successfully cleared edge data from database");
    }
    catch (error) {
        console.error(error);
        return res.status(400).send("Could not clear edge data from database");
    }
});

export default router;
