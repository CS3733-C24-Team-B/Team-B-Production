import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {pathFindBFS} from "../utilities/algorithm.ts";

const router: Router = express.Router();
router.get("/:startNode/:endNode/", async function (req: Request, res: Response) {
   let nodes  =[] ;
    let path  =pathFindBFS(req.params.startNode, req.params.endNode)?.map(obj => obj);
    path=path!.slice().reverse();
    while ((path as string[]).length>0){
       const node_data  = await client.node.findUnique({where: {nodeID: (path as string[]).pop()}});
       nodes.push(node_data);
    }

        if (nodes === null) {
            console.error("No node data found in database");
            res.sendStatus(204);    // no data
        } else {

            res.send(JSON.stringify(nodes.map(obj => obj!.longName)));
            console.info("Successfully sent " + nodes.length + " nodes to frontend");
        }



});
export default router;
