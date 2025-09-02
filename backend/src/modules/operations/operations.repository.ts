import { Repository } from 'typeorm';
import { AppDataSource } from '../../config/data-source';
import { Operation } from '../../entities/Operation';

export class OperationsRepository {
    private repo: Repository<Operation>;

    constructor() {
        this.repo = AppDataSource.getRepository(Operation);
    }

    save(op: Partial<Operation>) {
        return this.repo.save(op);
    }
}
