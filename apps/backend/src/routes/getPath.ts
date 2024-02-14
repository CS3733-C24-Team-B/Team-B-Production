import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {pathfindAStar, pathFindBFS} from "../utilities/algorithm.ts";
const router: Router = express.Router();
let searchType = false;
router.post("/change",async function (req: Request, res: Response){
    console.log("TEST 1");
    changeSearch();
    req;
    res.sendStatus(200);
});
router.get("/currentAlg",async function (req: Request, res: Response){
    res.send(searchType);
    req;
    res.sendStatus(200);
});


function changeSearch(){
    if(searchType){
        console.log("ASTAR enabled");
        searchType=!searchType;
    }else{
        console.log("BFS enabled");
        searchType=!searchType;
    }
}
router.get("/:startNode/:endNode/", async function (req: Request, res: Response) {
    let nodes  =[] ;

    let path:string[]  = [];
    if(searchType){
        path=pathfindAStar(req.params.startNode, req.params.endNode)?.map(obj => obj)as string[];
    }
    else{
        path=pathFindBFS(req.params.startNode, req.params.endNode)?.map(obj => obj)as string[];
    }
    path=path!.slice().reverse();

    while ((path as string[]).length>0){
        const node_data  = await client.node.findUnique({where: {nodeID: (path as string[]).pop()}});
        nodes.push(node_data);
    }

    if (nodes === null) {
        console.error("No node data found in database");
        res.sendStatus(204);    // no data
    } else {

        res.send(JSON.stringify(nodes));
        console.info("Successfully sent " + nodes.length + " nodes to frontend");
    }



});
export default router;
