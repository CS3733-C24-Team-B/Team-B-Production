import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import pathRouter from "./routes/getPath.ts";
import loadNodesRouter from "./routes/loadNode.ts";
import loadEdgesRouter from "./routes/loadEdge.ts";
import serviceRouter from "./routes/serviceRequest.ts";
import sanitationRouter from "./routes/serviceRequestSanitation.ts";
import maintenanceRouter from "./routes/serviceRequestMaintenance.ts";
import internalTransportRouter from "./routes/serviceRequestInternalTransport.ts";
import medicineRouter from "./routes/serviceRequestMedicine.ts";
import languageRouter from "./routes/serviceRequestLanguage.ts";
import employeeRouter from "./routes/employee.ts";

const app: Express = express(); // Set up the backend

// Setup generic middle wear
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
app.use("/api/db-get-path", pathRouter);
app.use("/api/db-load-nodes", loadNodesRouter);
app.use("/api/db-load-edges", loadEdgesRouter);
app.use("/api/service-request", serviceRouter);
app.use("/api/service-request/sanitation", sanitationRouter);
app.use("/api/service-request/maintenance", maintenanceRouter);
app.use("/api/service-request/internal-transport", internalTransportRouter);
app.use("/api/service-request/medicine", medicineRouter);
app.use("/api/service-request/language", languageRouter);
app.use("/api/employee", employeeRouter);

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
