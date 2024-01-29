import { readFileSync } from "fs";

function readCSVToArray(filePath: string): string[] {
    // read file
    const fileContent: string = readFileSync(filePath, "utf-8");
    const lines: string[] = fileContent.split(/\r?\n/);
    lines.splice(0, 1);                     // remove 1st line (column headings)
    lines.splice(lines.length - 1, 1);      // remove last line (empty line)
    return lines;
}

/**
 * Reads data from a node CSV file and returns a list of JSON objects.
 *
 * Format example:
 * data: {
 *     nodeID: 'CCONF001L1',
 *     xcoord: 2255,
 *     ycoord: 849,
 *     floor: 'L1',
 *     building: '45 Francis',
 *     nodeType: 'CONF',
 *     longName: 'Anesthesia Conf Floor L1',
 *     shortName: 'Conf C001L1'
 * }
 *
 * @param filePath
 * @return nodeData
 */
export function readNodeCSV(filePath: string) {

    // create place to store edge data in JSON format
    const nodeData = [];

    // read file
    const lines: string[] = readCSVToArray(filePath);

    // loop through lines and put into JSON format
    for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(',');
        nodeData[i] = {
            nodeID: data[0],
            xcoord: Number(data[1]),
            ycoord: Number(data[2]),
            floor: data[3],
            building: data[4],
            nodeType: data[5],
            longName: data[6],
            shortName: data[7]
        };
    }

    console.log(nodeData.length + " nodes read");

    return nodeData;
}

/**
 * Reads data from an edge CSV file and returns a list of JSON objects.
 *
 * Format example:
 * data: {
 *     edgeID: 'CCONF002L1_WELEV00HL1',
 *     startNodeID: 'CCONF002L1',
 *     endNodeID: 'WELEV00HL1'
 * }
 *
 * @param filePath
 * @return edgeData
 */
export function readEdgeCSV(filePath: string) {

    // create place to store edge data in JSON format
    const edgeData = [];

    // read file
    const lines: string[] = readCSVToArray(filePath);

    // loop through lines and put into JSON format
    for (let i: number = 0; i < lines.length; i++) {
        const data: string[] = lines[i].split(',');
        edgeData[i] = {
            edgeID: data[0],
            startNodeID: data[1],
            endNodeID: data[2]
        };
    }

    console.log(edgeData.length + " edges read");

    return edgeData;
}
