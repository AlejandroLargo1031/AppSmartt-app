import { z } from 'zod';

export const createOperationSchema = z.object({
    type: z.enum(['BUY', 'SELL']),
    amount: z.number().positive(),
    currency: z.string().min(3).max(8),
});

export type CreateOperationDTO = z.infer<typeof createOperationSchema>;
