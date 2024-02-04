import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {pathfindAStar, pathFindBFS} from "../utilities/algorithm.ts";
const router: Router = express.Router();
let searchType = 0;
router.post("/change",async function (req: Request, res: Response){
    console.log("TEST 1");
    changeSearch();
    req;
    res;
});


 function changeSearch(){
    if(searchType===0){
        console.log("ASTAR enabled");
        searchType=1;
    }else{
        console.log("BFS enabled");
        searchType=0;
    }
}
router.get("/:startNode/:endNode/", async function (req: Request, res: Response) {
   let nodes  =[] ;

    let path:string[]  = [];
    if(searchType===1){
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

            res.send(JSON.stringify(nodes.map(obj => obj!.longName)));
            console.info("Successfully sent " + nodes.length + " nodes to frontend");
        }



});
export default router;
