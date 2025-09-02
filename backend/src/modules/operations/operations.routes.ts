import { Router } from 'express';
import { authMiddleware } from '../../middlewares/auth.middleware';
import { OperationsController } from './operations.controller';

export const operationsRouter = Router();

operationsRouter.post('/', authMiddleware, OperationsController.create);
operationsRouter.get('/', authMiddleware, OperationsController.getAll);
