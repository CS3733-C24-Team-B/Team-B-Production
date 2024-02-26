import React, { useEffect, useState } from "react";
import axios from "axios";
import { Node } from "database";
import {
  Alert,
  CircularProgress,
  FormControl,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Select,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import Divider from "@mui/material/Divider";
import FilterListIcon from "@mui/icons-material/FilterList";

const latoTheme = createTheme({
  components: {
    // Name of the component
    MuiTableCell: {
      styleOverrides: {
        // Name of the slot
        root: {
          // Some CSS
          fontFamily: "Lato",
        },
      },
    },
  },
});

enum nodeSortField {
  off,
  nodeID,
  xCoord,
  yCoord,
  floor,
  building,
  nodeType,
  longName,
  shortName,
}

export default function NodeTable() {
  const [nodeData, setNodeData] = useState<Node[]>([]);
  const [sortUp, setSortUp] = useState(true);
  const [refresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typeSort, setTypeSort] = useState<keyof typeof nodeSortField>();
  const [menuAnchor, setMenuAnchor] = useState(null);
  const [filterType, setFilterType] = useState("none");
  const [filterFunction, setFilterFunction] = useState<(node: Node) => boolean>(
    () => () => {
      return true;
    },
  );
  const filterOptions = new Set<string>();
  const [filterVal, setFilterVal] = useState("None");
  const openMenu = Boolean(menuAnchor);
  const [submitAlert, setSubmitAlert] = useState(false);
  const [isError] = useState(false);
  const [alertText] = useState("");

  useEffect(() => {
    async function fetch() {
      const res = await axios.get("/api/nodes/read");
      setNodeData(res.data);
    }

    fetch().then(() => {
      setLoading(false);
    });
  }, [refresh]);

  function sortNodes(sortField: nodeSortField): void {
    let nodesCopy: Node[] = [...nodeData];
    switch (sortField) {
      case nodeSortField.off:
        return;
      case nodeSortField.nodeID:
        nodesCopy.sort((a: Node, b: Node) => a.nodeID.localeCompare(b.nodeID));
        break;
      case nodeSortField.xCoord:
        nodesCopy.sort((a: Node, b: Node) => b.xcoord - a.xcoord);
        break;
      case nodeSortField.yCoord:
        nodesCopy.sort((a: Node, b: Node) => b.ycoord - a.ycoord);
        break;
      case nodeSortField.floor:
        nodesCopy.sort((a: Node, b: Node) => a.floor.localeCompare(b.floor));
        break;
      case nodeSortField.building:
        nodesCopy.sort((a: Node, b: Node) =>
          a.building.localeCompare(b.building),
        );
        break;
      case nodeSortField.nodeType:
        nodesCopy.sort((a: Node, b: Node) =>
          a.nodeType.localeCompare(b.nodeType),
        );
        break;
      case nodeSortField.longName:
        nodesCopy.sort((a: Node, b: Node) =>
          a.longName.localeCompare(b.longName),
        );
        break;
      case nodeSortField.shortName:
        nodesCopy.sort((a: Node, b: Node) =>
          a.shortName.localeCompare(b.shortName),
        );
        break;
    }
    if (!sortUp) {
      nodesCopy = nodesCopy.reverse();
    }
    setTypeSort(nodeSortField[sortField] as keyof typeof nodeSortField);
    setNodeData(nodesCopy);
  }

  const filterNode = nodeData.filter(filterFunction);

  const arrayNode = filterNode.map((node: Node) => (
    <TableRow>
      <TableCell>{node.nodeID}</TableCell>
      <TableCell>{node.xcoord}</TableCell>
      <TableCell>{node.ycoord}</TableCell>
      <TableCell>{node.floor}</TableCell>
      <TableCell>{node.building}</TableCell>
      <TableCell>{node.nodeType}</TableCell>
      <TableCell>{node.longName}</TableCell>
      <TableCell>{node.shortName}</TableCell>
    </TableRow>
  ));

  function fillOptions(nodeKey: keyof Node) {
    filterOptions.clear();
    nodeData.forEach((node) => {
      filterOptions.add(node[nodeKey] + "");
    });
  }

  function FilterSelect(props: { nodeKey: keyof Node }) {
    const { nodeKey } = props;
    fillOptions(nodeKey);
    const arr: string[] = [];
    const iter = filterOptions.values();
    for (const str of iter) {
      arr.push(str);
    }

    return (
      <>
        <Divider />
        <Select
          value={filterVal}
          label=""
          onChange={(e) => {
            setFilterVal(e.target.value);
            setFilterFunction(() => (node: Node) => {
              return (
                e.target.value === "None" || node[nodeKey] === e.target.value
              );
            });
          }}
        >
          <MenuItem value={"None"}>{"None"}</MenuItem>
          {arr.map((str) => (
            <MenuItem value={str}>{str}</MenuItem>
          ))}
        </Select>
      </>
    );
  }

  return (
    <div className={"AD-TwoColumns2"}>
      <div className={"AD-TestCard2"}>
        <Menu
          open={openMenu}
          onClose={() => {
            setMenuAnchor(null);
          }}
          anchorEl={menuAnchor}
        >
          <FormControl style={{ minWidth: 180, gap: 10, padding: 10 }}>
            <Select
              value={filterType}
              label=""
              onChange={(e) => {
                setFilterVal("None");
                setFilterType(e.target.value);
                setFilterFunction(() => () => {
                  return true;
                });
              }}
            >
              <MenuItem value={"none"}>None</MenuItem>
              <MenuItem value={"floor"}>Floor</MenuItem>
              <MenuItem value={"building"}>Building</MenuItem>
              <MenuItem value={"nodeType"}>Node Type</MenuItem>
            </Select>
            {
              {
                floor: <FilterSelect nodeKey={"floor"} />,
                building: <FilterSelect nodeKey={"building"} />,
                nodeType: <FilterSelect nodeKey={"nodeType"} />,
                none: <></>,
              }[filterType]
            }
          </FormControl>
        </Menu>
        <IconButton
          onClick={(e) => {
            setMenuAnchor(e.currentTarget);
          }}
          style={{ borderRadius: 0, width: 72 }}
        >
          <FilterListIcon />
        </IconButton>
        <br />
        {loading ? (
          <CircularProgress className="center-text" />
        ) : (
          <ThemeProvider theme={latoTheme}>
            <TableContainer
              component={Paper}
              className="service-tables"
              sx={{ maxHeight: "70vh" }}
            >
              <Table stickyHeader>
                <colgroup>
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                  <col width="12.5%" />
                </colgroup>
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Node ID
                      <IconButton
                        style={{
                          color: typeSort === "nodeID" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.nodeID);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      X-Coord
                      <IconButton
                        style={{
                          color: typeSort === "xCoord" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.xCoord);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Y-Coord
                      <IconButton
                        style={{
                          color: typeSort === "yCoord" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.yCoord);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Floor
                      <IconButton
                        style={{
                          color: typeSort === "floor" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.floor);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Building
                      <IconButton
                        style={{
                          color: typeSort === "building" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.building);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Node Type
                      <IconButton
                        style={{
                          color: typeSort === "nodeType" ? "#34AD84" : "",
                          width: "1.5vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.nodeType);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Long Name
                      <IconButton
                        style={{
                          color: typeSort === "longName" ? "#34AD84" : "",
                          width: "2vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.longName);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                    <TableCell>
                      Short Name
                      <IconButton
                        style={{
                          color: typeSort === "shortName" ? "#34AD84" : "",
                          width: "1.5vw",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortNodes(nodeSortField.shortName);
                        }}
                      >
                        {sortUp ? (
                          <ArrowUpwardIcon style={{ fontSize: "0.65em" }} />
                        ) : (
                          <ArrowDownwardIcon style={{ fontSize: "0.65em" }} />
                        )}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>{arrayNode}</TableBody>
              </Table>
            </TableContainer>
          </ThemeProvider>
        )}
      </div>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        open={submitAlert}
        autoHideDuration={3500}
        onClose={() => {
          setSubmitAlert(false);
        }}
      >
        <Alert severity={isError ? "error" : "success"} sx={{ width: "100%" }}>
          {alertText}
        </Alert>
      </Snackbar>
    </div>
  );
}
