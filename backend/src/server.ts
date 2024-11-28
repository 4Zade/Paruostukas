import express from 'express';
import dotenv from 'dotenv';
import runDatabase from './database/mongo.database';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';

import Routes from './routes/routes';

import { errorHandler } from './middlewares/error.middleware';

const app: express.Application = express();
const PORT: number | string = process.env.PORT || 5000;

function runServer() {
    dotenv.config();

    try {
        runDatabase();

        app.use(express.json());
        app.use(cookieParser());
        
        app.use(cors({
            origin: "http://localhost:5173",
            credentials: true,
            allowedHeaders: ["Authorization", "Content-Type"],
        }))

        app.use('/images', express.static(path.join(__dirname, 'images')));

        app.use("/api", Routes)

        app.use(errorHandler as any);

        app.listen(PORT, () => {
            console.log(`[\x1b[34mExpress\x1b[0m] Server running on port ${PORT}`)
        })
    }
    catch (err: unknown) {
        console.log(err);
    }
}

runServer();