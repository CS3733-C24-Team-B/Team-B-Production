import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    const node_data = await client.node.findMany();
    if (node_data === null) {
        console.error("No node data found in database");
        res.sendStatus(204);    // no data
    }
    else {
        res.send(JSON.stringify(node_data));
        console.info("Successfully sent " + node_data.length + " nodes to frontend");
    }

});

export default router;
