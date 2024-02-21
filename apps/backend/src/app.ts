import createError, { HttpError } from "http-errors";
import express, { Express, NextFunction, Request, Response } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import {auth} from "express-oauth2-jwt-bearer";
import pathRouter from "./routes/getPath.ts";
import readNodesRouter from "./routes/readNodes.ts";
import readEdgesRouter from "./routes/readEdges.ts";
import editNodesRouter from "./routes/editNodes.ts";
import editEdgesRouter from "./routes/editEdges.ts";
import serviceRouter from "./routes/serviceRequest.ts";
import employeeRouter from "./routes/employee.ts";
import adminEmployeeRouter from "./routes/adminEmployee.ts";

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
app.use("/api/path", pathRouter);
app.use("/api/nodes/read", readNodesRouter);
app.use("/api/edges/read", readEdgesRouter);

app.use(auth({
    audience: "/api",
    issuerBaseURL: "https://dev-emppp88ojksbdj0d.us.auth0.com/",
    tokenSigningAlg: "RS256"
}));

// More routers. All these routers are AFTER the auth,
// so all these routes require an authentication token.
app.use("/api/nodes", editNodesRouter);
app.use("/api/edges", editEdgesRouter);
app.use("/api/service-request", serviceRouter);
app.use("/api/employee", employeeRouter);
app.use("/api/admin-employee", adminEmployeeRouter);

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
