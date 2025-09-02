import { Request, Response, NextFunction } from "express";
import * as jwt from "jsonwebtoken";
import { HttpError } from "../utils/HttpError";

export interface AuthPayload {
    sub: string;
    email?: string;
    }

    declare global {
    namespace Express {
        interface Request {
        auth?: AuthPayload;
        }
    }
    }

    export function authMiddleware(
    req: Request,
    _res: Response,
    next: NextFunction
    ) {
    const header = req.headers.authorization;
    if (!header?.startsWith("Bearer ")) throw new HttpError(401, "Unauthorized");

    const token = header.substring(7);
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET!) as AuthPayload;
        req.auth = payload;
        next();
    } catch {
        throw new HttpError(401, "Invalid token");
    }
}
