import { readFileSync } from "fs";

export function readCSV(filePath: string): any[] {
  //Read the file
  const fileContent = readFileSync(filePath, "utf8");

  //Split the file content by new line to get the rows
  const lines = fileContent.split("\n");

  //Extract headers
  const headers = lines[0].split(",");

  //Parse each line
  const data = lines.slice(1).map((line) => {
    const values = line.split(",");
    return headers.reduce((obj, header, index) => {
      obj[header] = values[index];
      return obj;
    }, {} as any);
  });

  return data;
}
//use to iterate/print out different values of each node
export function createNodeList() {
  const filePath = "src/csvs/L1Nodes.csv";
  const nodeString = readCSV(filePath);
  const nodeList: string[] = [];
  for (const node of nodeString) {
    nodeList.push(node);
  }
  nodeList.pop();
  for (const node of nodeList) {
    const curr = JSON.stringify(node);
    console.log(curr.substring(68, curr.length - 2).split(" ")[3]);
  }
}

//const filePath = "src/csvs/L1Nodes.csv";
//console.log(readCSV(filePath));
//const filePath = "src/csvs/L1Edges.csv";
//console.log(readCSV(filePath));
