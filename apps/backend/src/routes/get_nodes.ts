import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";

const router: Router = express.Router();

router.get("/", async function (req: Request, res: Response) {

    const node_data = client.node.findMany();

    if (node_data === null) {
        console.error("No node data found in database");
        res.sendStatus(204);    // no data
    }
    else {
        res.send(node_data);
    }

});

export default router;
