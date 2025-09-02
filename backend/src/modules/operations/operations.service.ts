import { AppDataSource } from '../../config/data-source';
import { Operation } from '../../entities/Operation';
import { CreateOperationDTO } from './operations.schema';

export class OperationsService {
  async create(userId: string, dto: CreateOperationDTO) {
    return AppDataSource.transaction(async (manager) => {
      // Validar que el amount sea positivo
      if (dto.amount <= 0) {
        throw new Error('Amount must be positive');
      }

      const op = manager.create(Operation, {
        userId,
        type: dto.type,
        amount: dto.amount.toFixed(2), // guardar como string
        currency: dto.currency.toUpperCase(),
      });
      const saved = await manager.save(Operation, op);
      return saved;
    });
  }

  async getAllByUserId(userId: string) {
    const operationRepository = AppDataSource.getRepository(Operation);
    return operationRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' }
    });
  }
}
