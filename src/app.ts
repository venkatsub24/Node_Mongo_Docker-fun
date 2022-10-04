import express, {
  Application,
  ErrorRequestHandler,
  NextFunction,
  Request,
  Response,
} from "express";
import http from "http";
import mongoose from "mongoose";
import createHttpError from "http-errors";

import { config } from "./config/config";
import Logging from "./library/Logging";

const port: number = config.server.port;
const app: Application = express();

// connect to Mongo
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    Logging.info("Mongo Connected");
    startServer();
  })
  .catch((error) => {
    Logging.error("Error connecting to Mongo: ");
    Logging.error(error);
  });

/** Start the server with Logging middleware */
const startServer = () => {
  app.use((req: Request, res: Response, next: NextFunction) => {
    /** Log the request */
    Logging.info(`Incoming -> Method: [${req.method}] - Url: [${req.url}]`);

    res.on("finish", () => {
      /** Log the response */
      Logging.info(
        `Incoming -> Method: [${req.method}] - Url: [${req.url}] - Status: [${res.statusCode}]`
      );
    });

    next();
  });

  app.use(express.urlencoded({ extended: true }));
  app.use(express.json());

  /** API Rules */
  app.use((req: Request, res: Response, next: NextFunction) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );

    if (req.method === "OPTIONS") {
      res.header(
        "Access-Control-Allow-Methods",
        "PUT, POST, PATCH, DELETE, GET"
      );
      return res.status(200).json({});
    }

    next();
  });

  /** Routes */
  app.get("/", (req: Request, res: Response) => {
    res.status(200).json({ message: "Hello!" });
  });

  // Middleware for error handling
  app.use((req: Request, res: Response, next: NextFunction) => {
    const error = new Error("Not found");
    Logging.error(error);
    next(new createHttpError.NotFound());
  });

  const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
    Logging.error(err);
    res.status(err.status || 500);
    res.send({
      status: err.status || 500,
      message: err.message,
    });
  };

  app.use(errorHandler);

  http
    .createServer(app)
    .listen(port, () => Logging.info(`Server is running on port ${port}`));
};
