import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Index } from 'typeorm';

export type OperationType = 'BUY' | 'SELL';

@Entity({ name: 'operations' })
export class Operation {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'varchar', length: 8 })
    @Index()
    type!: OperationType; // BUY | SELL

    @Column({ type: 'numeric', precision: 18, scale: 2 })
    amount!: string; // numeric como string en TypeORM

    @Column({ type: 'varchar', length: 8 })
    currency!: string; // e.g., USD, EUR

    @Column({ type: 'uuid' })
    @Index()
    userId!: string;

    @CreateDateColumn()
    createdAt!: Date;
}
