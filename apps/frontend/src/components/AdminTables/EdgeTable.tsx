import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth0 } from "@auth0/auth0-react";
import { Edge } from "database";
import {
  Alert,
  CircularProgress,
  IconButton,
  Paper,
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

enum edgeSortField {
  off,
  edgeID,
  startNodeID,
  endNodeID,
}

export default function EdgeTable() {
  const { getAccessTokenSilently } = useAuth0();
  const [edgeData, setEdgeData] = useState<Edge[]>([]);
  const [sortUp, setSortUp] = useState(true);
  const [refresh] = useState(false);
  const [loading, setLoading] = useState(true);
  const [typeSort, setTypeSort] = useState<keyof typeof edgeSortField>();
  const [submitAlert, setSubmitAlert] = useState(false);
  const [isError] = useState(false);
  const [alertText] = useState("");

  useEffect(() => {
    async function fetch() {
      const res = await axios.get("/api/edges/read");
      setEdgeData(res.data);
    }

    fetch().then(() => {
      setLoading(false);
    });
  }, [getAccessTokenSilently, refresh]);

  function sortEdges(sortField: edgeSortField) {
    let edgesCopy: Edge[] = [...edgeData];
    switch (sortField) {
      case edgeSortField.off:
        return;
      case edgeSortField.edgeID:
        edgesCopy.sort((a: Edge, b: Edge) => a.edgeID.localeCompare(b.edgeID));
        break;
      case edgeSortField.startNodeID:
        edgesCopy.sort((a: Edge, b: Edge) =>
          a.startNodeID.localeCompare(b.startNodeID),
        );
        break;
      case edgeSortField.endNodeID:
        edgesCopy.sort((a: Edge, b: Edge) =>
          a.endNodeID.localeCompare(b.endNodeID),
        );
        break;
    }
    if (!sortUp) {
      edgesCopy = edgesCopy.reverse();
    }
    setTypeSort(edgeSortField[sortField] as keyof typeof edgeSortField);
    setEdgeData(edgesCopy);
  }

  const arrayEdge = edgeData.map((edge: Edge) => (
    <TableRow>
      <TableCell>{edge.edgeID}</TableCell>
      <TableCell>{edge.startNodeID}</TableCell>
      <TableCell>{edge.endNodeID}</TableCell>
    </TableRow>
  ));
  return (
    <div className={"AD-TwoColumns2"}>
      <div className={"AD-TestCard2"}>
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
                <TableHead>
                  <TableRow>
                    <TableCell>
                      Edge ID
                      <IconButton
                        style={{
                          color: typeSort === "edgeID" ? "#34AD84" : "",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortEdges(edgeSortField.edgeID);
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
                      Start Node
                      <IconButton
                        style={{
                          color: typeSort === "startNodeID" ? "#34AD84" : "",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortEdges(edgeSortField.startNodeID);
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
                      End Node
                      <IconButton
                        style={{
                          color: typeSort === "endNodeID" ? "#34AD84" : "",
                        }}
                        onClick={() => {
                          setSortUp(!sortUp);
                          sortEdges(edgeSortField.endNodeID);
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
                <TableBody>{arrayEdge}</TableBody>
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
