import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {pathfindAStar, pathFindBFS, pathFindDFS} from "../utilities/algorithm.ts";
const router: Router = express.Router();
let searchType = 0;
router.post("/change/:type",async function (req: Request, res: Response){
    console.log(req.params.type +" is the new search");
    changeSearch(parseInt(req.params.type));
    res.sendStatus(200);
});
router.get("/currentAlg",async function (req: Request, res: Response){
    res.send(searchType);
    res.sendStatus(200);
});


function changeSearch(type:number){
        searchType=type;
}
router.get("/:startNode/:endNode/", async function (req: Request, res: Response) {
    const nodes = [] ;

    let path:string[]  = [];
    if(searchType===0){
        path=pathfindAStar(req.params.startNode, req.params.endNode)?.map(obj => obj)as string[];
    }
    else if (searchType===1){
        path=pathFindBFS(req.params.startNode, req.params.endNode)?.map(obj => obj)as string[];
    }
    else if (searchType===2){
        path=pathFindDFS(req.params.startNode, req.params.endNode)?.map(obj => obj)as string[];
    }
    path=path!.slice().reverse();

    while ((path as string[]).length>0){
        const node_data  = await client.node.findUnique({where: {nodeID: (path as string[]).pop()}});
        nodes.push(node_data);
    }

    if (nodes.length == 0) {
        console.error("No node data found in database");
        res.sendStatus(204);    // no data
    } else {
        res.send(JSON.stringify(nodes));
        console.info("Successfully sent " + nodes.length + " nodes to frontend");
    }



});
export default router;
