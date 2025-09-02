import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { operationsRouter } from './modules/operations/operations.routes';
import { errorMiddleware } from './middlewares/error.middleware';
import { authRouter } from './modules/auth/auth.routes';

export const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/operations", operationsRouter);

app.use(errorMiddleware);
