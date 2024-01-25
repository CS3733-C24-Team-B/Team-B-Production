import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    const edge_data = await client.edge.findMany();
    if (edge_data === null) {
        console.error("No edge data found in database");
        res.sendStatus(204);    // no data
    }
    else {
        res.send(edge_data);
        console.info("Successfully sent " + edge_data.length + " edges to frontend");
    }

});

export default router;
