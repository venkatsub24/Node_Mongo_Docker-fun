import express, {Application, ErrorRequestHandler, NextFunction, Request, Response} from 'express';
import createHttpError from 'http-errors';
import {config} from 'dotenv';

config();

const port: number = Number(process.env.PORT) || 3000;
const app: Application = express();

app.get('/', (req: Request, res: Response) => {
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
        message: err.message
    })
};

app.use(errorHandler);

app.listen(port, ()=> console.log(`Listening on port:${port}`));