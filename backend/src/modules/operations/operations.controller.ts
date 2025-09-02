import { Request, Response } from 'express';
import { createOperationSchema } from './operations.schema';
import { OperationsService } from './operations.service';
import { HttpError } from '../../utils/HttpError';

const service = new OperationsService();

export class OperationsController {
    static async create(req: Request, res: Response) {
        const parsed = createOperationSchema.safeParse(req.body);
        if (!parsed.success) throw new HttpError(400, 'Invalid payload');

        const userId = req.auth?.sub;
        if (!userId) throw new HttpError(401, 'Unauthorized');

        const saved = await service.create(userId, parsed.data);
        const { id, type, amount, currency, createdAt } = saved;
        res.status(201).json({ id, type, amount, currency, createdAt });
    }

    static async getAll(req: Request, res: Response) {
        const userId = req.auth?.sub;
        if (!userId) throw new HttpError(401, 'Unauthorized');

        const operations = await service.getAllByUserId(userId);
        res.status(200).json(operations);
    }
}
