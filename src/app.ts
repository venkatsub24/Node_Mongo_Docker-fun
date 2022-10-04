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

const port: number = config.server.port;
const app: Application = express();

// connect to Mongo
mongoose
  .connect(config.mongo.url, { retryWrites: true, w: "majority" })
  .then(() => {
    console.log("mongo connected");
  })
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req: Request, res: Response) => {
  res.send("Hello");
});

// Middleware for error handling
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new createHttpError.NotFound());
});

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  res.status(err.status || 500);
  res.send({
    status: err.status || 500,
    message: err.message,
  });
};

app.use(errorHandler);

app.listen(port, () => console.log(`Listening on port:${port}`));
