import express, {Router, Request, Response} from "express";
import client from "../bin/database-connection.ts";
import {
    AStar,
    BFS,
    DFS, Dijkstra,
    Pathfind
} from "../utilities/algorithm.ts";
const router: Router = express.Router();
let searchType = 0;
router.post("/change/:type",async function (req: Request, res: Response){
    console.log(req.params.type +" is the new search");
    changeSearch(parseInt(req.params.type));
    res.sendStatus(200);
});
router.get("/currentAlg",async function (req: Request, res: Response){
    res.status(200).send(searchType);
});


function changeSearch(type:number){
        searchType=type;
}
router.get("/:startNode/:endNode/", async function (req: Request, res: Response) {
    const nodes  = [] ;
    let pathfind: Pathfind= new Pathfind(new AStar());
    let path:string[];
    if(searchType===0){
        pathfind=new Pathfind(new AStar());
    }
    else if (searchType===1){
        pathfind=new Pathfind(new BFS());
    }
    else if (searchType===2){
        pathfind=new Pathfind(new DFS());
    }
    else if (searchType===3){
        pathfind=new Pathfind(new Dijkstra());
    }
    const p = await pathfind.search(req.params.startNode, req.params.endNode);
    path = p?.map(obj => obj)as string[];
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
    }

});
export default router;
