import { router, publicProcedure } from '../trpc';
import { User, InferSchema } from 'hiem';
import { z } from 'zod';

export const userRouter = router({
    get: publicProcedure
        .input(z.object({
            id: z.string().optional()
        }))
        .query(({ ctx, input }) => {           
            if(typeof input.id !== 'string') {
                return ctx.getDocumentOrThrow(User, ctx.req.user.id, false);
            }
                
            return ctx.getDocumentOrThrow(User, input.id);
        })
})