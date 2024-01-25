import { test } from "vitest";
import {createEdgeList, createNodeList, readEdgeCSV} from "../src/utilities/algorithm.ts";

/*function sum(a: number, b: number) {
  return a + b;
}
test("adds 1 + 2 to equal 3", () => {
  expect(sum(1, 2)).toBe(3);
});
*/
test("nodelist", () => {
  createNodeList();
});
test("edgeList", () => {
    createEdgeList();
});

test("addEdgesToDB", () => {
    readEdgeCSV("/Users/katystuparu/WebstormProjects/Team-B-Production/apps/backend/src/csvs/L1Edges.csv");
});

test("bfs",() =>{
    breadthFirstSearch();
});

test("findNode",() =>{
    findNode("CCONF002L1");
});
test("pathfindBFS",() =>{
    pathFindBFS(findNode("WELEV00HL1"),findNode("CSERV001L1"));
});


test("addNodeToDB", () =>{
    readNodeCSV("src/csvs/L1Nodes.csv");
});
