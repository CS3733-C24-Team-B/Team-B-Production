import { test } from "vitest";
import {createEdgeList, createNodeList} from "../src/utilities/algorithm.ts";

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
