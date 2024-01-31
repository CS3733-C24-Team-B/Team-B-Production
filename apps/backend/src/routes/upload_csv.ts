import express, { Router, Request, Response } from "express";
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router: Router = express.Router();

router.post("/", upload.single('csvFile'), async function (req: Request, res: Response) {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        // Log the file name
        console.log('Uploaded file name:', req.file.originalname);

        // To read file use: req.file.stream

        // Send a response back
        res.status(200).send('File uploaded successfully: ' + req.file.originalname);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error processing file.');
    }
});

export default router;
