import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import exampleRouter from "./routes/example.ts";
import nodesRouter from "./routes/get_nodes.ts";
import edgesRouter from "./routes/get_edges.ts";
import importNodesRouter from "./routes/dbImportNode.ts";
import importEdgesRouter from "./routes/dbImportEdge.ts";
import exportNodeRouter from "./routes/dbExportNodeToCSV.ts";
import exportEdgeRouter from "./routes/dbExportEdgeToCSV.ts";

const app: Express = express(); // Setup the backend

// Setup generic middlewear
app.use(
  logger("dev", {
    stream: {
      // This is a "hack" that gets the output to appear in the remote debugger :)
      write: (msg) => console.info(msg),
    },
  }),
); // This records all HTTP requests
app.use(express.json()); // This processes requests as JSON
app.use(express.urlencoded({ extended: false })); // URL parser
app.use(cookieParser()); // Cookie parser

// Setup routers. ALL ROUTERS MUST use /api as a start point, or they
// won't be reached by the default proxy and prod setup
app.use("/api/high-score", exampleRouter);
app.use("/api/db-get-nodes", nodesRouter);
app.use("/api/db-get-edges", edgesRouter);
app.use("/api/db-import-nodes", importNodesRouter);
app.use("/api/db-import-edges", importEdgesRouter);
app.use("/api/db-export-nodes", exportNodeRouter);
app.use("/api/db-export-edges", exportEdgeRouter);

/**
 * Catch all 404 errors, and forward them to the error handler
 */
app.use(function (req: Request, res: Response, next: NextFunction): void {
  // Have the next (generic error handler) process a 404 error
  next(createError(404));
});

/**
 * Generic error handler
 */
app.use((err: HttpError, req: Request, res: Response): void => {
  res.statusMessage = err.message; // Provide the error message

  res.locals.error = req.app.get("env") === "development" ? err : {};

  // Reply with the error
  res.status(err.status || 500);
});

export default app; // Export the backend, so that www.ts can start it
