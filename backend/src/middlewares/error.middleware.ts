import { Request, Response, NextFunction } from 'express';
import { HttpError } from '../utils/HttpError';

export function errorMiddleware(err: any, _req: Request, res: Response, _next: NextFunction) {
    const status = err instanceof HttpError ? err.status : 500;
    const message = err instanceof HttpError ? err.message : 'Internal Server Error';
    if (process.env.NODE_ENV !== 'production') {
        // log mínimo sin secretos
        // eslint-disable-next-line no-console
        console.error(err);
    }
    res.status(status).json({ error: message });
    }
